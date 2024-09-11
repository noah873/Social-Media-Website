import { app, auth } from 'firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

function setupLoginElements() {
  const messageDiv = document.getElementById('message');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const signInButton = document.getElementById('signIn');
  const createAccountButton = document.getElementById('createAccount');

  signInButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .catch(() => {
            messageDiv.textContent = 'Invalid Email or Password';
        });
  });

  createAccountButton.addEventListener('click', () => {
      const email = emailInput.value;
      const password = passwordInput.value;

      createUserWithEmailAndPassword(auth, email, password)
        .catch(() => {
            messageDiv.textContent = 'Error Creating Account';
        });
  });
}

export {setupLoginElements};
