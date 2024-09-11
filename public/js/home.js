import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCaCCK38R9btLtT5SLCwRB97vv9qbj8RFM",
  authDomain: "social-media-website-db1fe.firebaseapp.com",
  projectId: "social-media-website-db1fe",
  storageBucket: "social-media-website-db1fe.appspot.com",
  messagingSenderId: "989794613612",
  appId: "1:989794613612:web:b757ace6b828d44087db49"
};

initializeApp(firebaseConfig);
const auth = getAuth();

function setupHomeElements() {
  const signOutButton = document.getElementById('signOut');
  
  signOutButton.addEventListener('click', () => {
    signOut(auth)
  });
}

export {setupHomeElements};
