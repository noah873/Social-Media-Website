//import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
//import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCaCCK38R9btLtT5SLCwRB97vv9qbj8RFM",
  authDomain: "social-media-website-db1fe.firebaseapp.com",
  projectId: "social-media-website-db1fe",
  storageBucket: "social-media-website-db1fe.appspot.com",
  messagingSenderId: "989794613612",
  appId: "1:989794613612:web:477dea72841398bb87db49"
};

initializeApp(firebaseConfig);
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    onAuthStateChanged(auth, user => {
        if (user) {
            if (path === '/login.html' || path === '/') {
                window.location.href = '/';
            }
        } else {
            if (path !== '/login.html') {
                window.location.href = '/login.html';
            }
        }
    });

    if (path === '/login.html') {
        const messageDiv = document.getElementById('message');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const signInButton = document.getElementById('sign-in');
        const createAccountButton = document.getElementById('create-account');

        signInButton.addEventListener('click', () => {
            const email = usernameInput.value;
            const password = passwordInput.value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    window.location.href = '/';
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
                    window.location.href = '/';
                })
                .catch(() => {
                    messageDiv.textContent = 'Account already Exists';
                });
        });
    }

    if (path === '/') {
        const signOutButton = document.getElementById('sign-out');

        signOutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.href = '/login.html';
            });
        });
    }
});


