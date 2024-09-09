import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

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

const loginDiv = document.getElementById('login');
const homepageDiv = document.getElementById('homepage');
const messageDiv = document.getElementById('message');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signOutButton = document.getElementById('sign-out');

function updateUI(user) {
    if (user) {
        loginDiv.classList.add('hidden');
        homepageDiv.classList.remove('hidden');
    } else {
        loginDiv.classList.remove('hidden');
        homepageDiv.classList.add('hidden');
    }
}

onAuthStateChanged(auth, user => {
    updateUI(user);
});

signOutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        updateUI(null);
        emailInput.value = '';
        passwordInput.value = '';
        messageDiv.textContent = '';
    });
});
