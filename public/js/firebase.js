import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { 
  getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider, 
  updatePassword, updateEmail, verifyBeforeUpdateEmail, sendEmailVerification 
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { 
  getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, doc, 
  setDoc, deleteDoc, updateDoc, getDoc, getDocs, serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaCCK38R9btLtT5SLCwRB97vv9qbj8RFM",
  authDomain: "social-media-website-db1fe.firebaseapp.com",
  projectId: "social-media-website-db1fe",
  storageBucket: "social-media-website-db1fe.appspot.com",
  messagingSenderId: "989794613612",
  appId: "1:989794613612:web:b757ace6b828d44087db49"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

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

// Export all required functions and variables
export { 
  app, auth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, 
  sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword, 
  updateEmail, verifyBeforeUpdateEmail, sendEmailVerification, db, fetchPosts, doc, setDoc, deleteDoc, updateDoc, 
  onSnapshot, collection, getDoc, getDocs, addPostToFirestore 
};
