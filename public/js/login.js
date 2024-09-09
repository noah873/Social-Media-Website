import {initializeApp, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, firebaseConfig, auth, loginDiv, homepageDiv, messageDiv, emailInput, passwordInput, updateUI, onAuthStateChanged} from "sharedCode.js";

const signInButton = document.getElementById('sign-in');
const createAccountButton = document.getElementById('create-account');

signInButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            updateUI(auth.currentUser);
        })
        .catch(() => {
            messageDiv.textContent = 'Invalid Email or Password';
        });
});

createAccountButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            updateUI(auth.currentUser);
        })
        .catch(() => {
            messageDiv.textContent = 'Error Creating Account';
        });
});
