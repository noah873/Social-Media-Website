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

document.addEventListener('DOMContentLoaded', () => {
    const loginDiv = document.getElementById('login');
    const homepageDiv = document.getElementById('homepage');
    const messageDiv = document.getElementById('message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const signInButton = document.getElementById('sign-in');
    const createAccountButton = document.getElementById('create-account');
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

    signInButton.addEventListener('click', () => {
        const email = usernameInput.value;
        const password = passwordInput.value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateUI(auth.currentUser);
            })
            .catch(() => {
                messageDiv.textContent = 'Invalid Username or Password';
            });
    });

    createAccountButton.addEventListener('click', () => {
        const email = usernameInput.value;
        const password = passwordInput.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateUI(auth.currentUser);
            })
            .catch(() => {
                messageDiv.textContent = 'Error Creating Account';
            });
    });

    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                updateUI(null);
            });
        });
    }
});
