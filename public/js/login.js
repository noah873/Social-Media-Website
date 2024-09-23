import { auth, signInWithEmailAndPassword } from './firebase.js';
import { renderHTML } from '../app.js';

function setupLoginElements() {
  // allows user to sign in after deleting account in same session
  sessionStorage.setItem('accountDeleted', 'false');
  
  const messageDiv = document.getElementById('message');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const signInButton = document.getElementById('signIn');
  const forgotPasswordButton = document.getElementById('forgotPassword');
  const createAccountButton = document.getElementById('createAccount');

  signInButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            console.error('Error Signing In: ', error);
            messageDiv.textContent = 'Invalid Email or Password';
        });
  });

  emailInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      signInButton.click();
    }
  });
  
  passwordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      signInButton.click();
    }
  });

  forgotPasswordButton.addEventListener('click', () => {
      renderHTML("resetPassword.html");
  });

  createAccountButton.addEventListener('click', () => {
      renderHTML("createAccount.html");
  });
}

export { setupLoginElements };
