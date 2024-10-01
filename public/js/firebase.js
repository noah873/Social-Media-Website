import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateEmail, verifyBeforeUpdateEmail, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

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

export { app, auth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateEmail, verifyBeforeUpdateEmail, sendEmailVerification, db, doc, setDoc, deleteDoc, updateDoc, onSnapshot, collection, getDocs };
