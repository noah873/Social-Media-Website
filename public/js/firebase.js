import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { 
  getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider, 
  updatePassword, updateEmail, verifyBeforeUpdateEmail, sendEmailVerification 
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { 
  getFirestore, collection, addDoc, query, where, orderBy, limit, onSnapshot, doc, 
  setDoc, deleteDoc, updateDoc, getDoc, getDocs, serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaCCK38R9btLtT5SLCwRB97vv9qbj8RFM",
  authDomain: "social-media-website-db1fe.firebaseapp.com",
  projectId: "social-media-website-db1fe",
  storageBucket: "social-media-website-db1fe.appspot.com",
  messagingSenderId: "989794613612",
  appId: "1:989794613612:web:b757ace6b828d44087db49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

// Function to upload a file to Firebase Storage
async function uploadFile(file, path) {
  try {
    // Create a reference for the file in the given path
    const storageRef = ref(storage, path);
    
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file);
    
    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Re-throw error for handling in calling function
  }
}

// Function to fetch the download URL of a file from Firebase Storage
async function getFileURL(path) {
  try {
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, path);
    
    // Get the download URL of the file
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error fetching file URL:', error);
    throw error;
  }
}

// Function to add a post to Firestore
async function addPostToFirestore(postContent) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Create a new document in the 'posts' collection
    const postRef = await addDoc(collection(db, "posts"), {
      userID: user.uid,
      content: postContent,
      datetime: serverTimestamp(), // automatically set server timestamp
      upvotes: 0,
      downvotes: 0
    });

    console.log("Post created with ID: ", postRef.id);
  } catch (error) {
    console.error("Error adding post: ", error);
  }
}

// Function to fetch posts from Firestore in descending order by datetime
async function fetchPosts(callback) {
  const postsQuery = query(collection(db, "posts"), orderBy("datetime", "desc"));
  
  onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      datetime: doc.data().datetime.toDate().toLocaleString(), // Convert Firestore timestamp to readable format
    }));
    
    callback(posts);
  });
}

// Function to get user data from Firestore
async function getUserData(userID) {
  try {
    const userRef = doc(db, 'users', userID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error(`No user found with ID: ${userID}`);
      return {};
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {};
  }
}

// Export all required functions and variables
export { 
  app, auth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, 
  sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword, 
  updateEmail, verifyBeforeUpdateEmail, sendEmailVerification, db, fetchPosts, doc, setDoc, deleteDoc, updateDoc, 
  onSnapshot, collection, addDoc, getDoc, getDocs, serverTimestamp, query, where, orderBy, addPostToFirestore,
  storage, ref, uploadFile, getFileURL, getUserData
};
