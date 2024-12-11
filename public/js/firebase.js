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

/* Dependency Injection Design Pattern (Creational) - This file imports, creates,
and exports Firebase functions and services, injecting dependencies into the rest of
our app. It initializes a Firebase app using our configuration keys, then using that 
to create instances of Firebase services like Firestore and Storage. This practice limits
the amount of HTTP GET Requests for these dependencies and makes the architecture of the
website more flexible and maintainable. Instead of each part of the website creating these
dependencies themselves, this file controls and manages that process.
*/
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

// Function to add a post (with optional image) to Firestore
async function addPostToFirestore(postContent, imageFile = null) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    let imageURL = null;

    // Upload the image to Firebase Storage if provided
    if (imageFile) {
      const filePath = `postImages/${user.uid}/${Date.now()}_${imageFile.name}`;
      imageURL = await uploadFile(imageFile, filePath);
    }

    // Create a new document in the 'posts' collection
    const postRef = await addDoc(collection(db, "posts"), {
      userID: user.uid,
      content: postContent,
      imageURL: imageURL, // Add image URL if available
      datetime: serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
    });

    console.log("Post created with ID: ", postRef.id);
  } catch (error) {
    console.error("Error adding post: ", error);
  }
}

// Function to update votes and manage voter tracking
async function updatePostVotes(postID, userID, voteType) {
  const postRef = doc(db, 'posts', postID);
  try {
    const postSnapshot = await getDoc(postRef);
    if (!postSnapshot.exists()) {
      console.error(`Post with ID ${postID} not found.`);
      return;
    }

    const postData = postSnapshot.data();
    const voters = postData.voters || {}; // Ensure voters field exists
    const currentVote = voters[userID] || null; // User's current vote

    // Update logic based on voteType and currentVote
    if (voteType === 'upvote') {
      if (currentVote === 'upvote') {
        delete voters[userID]; // Remove upvote
        postData.upvotes -= 1;
      } else {
        voters[userID] = 'upvote';
        if (currentVote === 'downvote') postData.downvotes -= 1;
        postData.upvotes += 1;
      }
    } else if (voteType === 'downvote') {
      if (currentVote === 'downvote') {
        delete voters[userID]; // Remove downvote
        postData.downvotes -= 1;
      } else {
        voters[userID] = 'downvote';
        if (currentVote === 'upvote') postData.upvotes -= 1;
        postData.downvotes += 1;
      }
    }

    // Write updates to Firestore
    await updateDoc(postRef, {
      upvotes: postData.upvotes,
      downvotes: postData.downvotes,
      voters,
    });

    console.log(`Updated post ${postID}:`, { upvotes: postData.upvotes, downvotes: postData.downvotes });
  } catch (error) {
    console.error('Error updating votes:', error);
  }
}

// Function to fetch posts from Firestore in descending order by datetime
async function fetchPosts(callback) {
  const postsQuery = query(collection(db, "posts"), orderBy("datetime", "desc"));

  onSnapshot(postsQuery, async (snapshot) => {
    const posts = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const postData = docSnap.data();

        try {
          const userRef = doc(db, 'users', postData.userID); // Ensure this is properly scoped
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            postData.profileImage = userData.profileImage || '/default_elements/default-profile.png';
          } else {
            postData.profileImage = '/default_elements/default-profile.png'; // Fallback if user not found
          }
        } catch (error) {
          console.error(`Failed to fetch user data for user ${postData.userID}:`, error);
          postData.profileImage = '/default_elements/default-profile.png'; // Fallback in case of errors
        }

        return {
          id: docSnap.id,
          ...postData,
          datetime: postData.datetime.toDate().toLocaleString(), // Convert Firestore timestamp to readable format
        };
      })
    );

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
  storage, ref, uploadFile, getFileURL, getUserData, updatePostVotes
};
