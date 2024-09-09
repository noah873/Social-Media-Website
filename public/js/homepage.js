import {initializeApp, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, firebaseConfig, auth, loginDiv, homepageDiv, messageDiv, emailInput, passwordInput, updateUI, onAuthStateChanged} from "sharedCode.js";

const signOutButton = document.getElementById('sign-out');

signOutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        updateUI(null);
        emailInput.value = 'Login';
        passwordInput.value = '';
        messageDiv.textContent = '';
    });
});
