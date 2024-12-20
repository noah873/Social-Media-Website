import { auth, signInWithEmailAndPassword } from './firebase.js';
import { renderHTML } from '../app.js';

function setupLoginElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const signInButton = document.getElementById('signIn');
  const forgotPasswordButton = document.getElementById('forgotPassword');
  const createAccountButton = document.getElementById('createAccount');

  signInButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
  
    if (!email || !password) {
      message2Div.textContent = 'Please fill in all fields and try again.';
      return;
    }

    /* Factory Method Design Pattern (Creational) - This Firebase signInWithEmailAndPassword function, along with other
    fulfilling Firebase functions, follow the Factory Method Pattern by abstracting the process of signing into a Firebase Auth
    account or creating an account then signing in. Firebase's design allows this API function call to specify/alter the type of
    objects/accounts to be created. The high level interface abstracts exact details of this process,
    providing account and data security, which aids our codes extensibility and maintenance.
    */
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        emailInput.value = ""; // Clear email input
        passwordInput.value = ""; // Clear password input
      })
      .catch((error) => {
        console.error('Error Signing In: ', error);
        messageDiv.textContent = 'Error Signing In';
  
        let errorMessage = error.message; // sample input: " Firebase: Password should be at least 6 characters (auth/weak-password)."
        errorMessage = errorMessage.trim().split(" "); // removes excess spaces and splits into array
        errorMessage[errorMessage.length - 1] = errorMessage[errorMessage.length - 1].replace("auth/", ""); // changes last element "(auth/weak-password)." to "(weak-password)."
        errorMessage = errorMessage.slice(1, errorMessage.length); // slices off first element in array
        errorMessage = errorMessage.join(" ") + " Please try again."; // rejoins array into string
        message2Div.textContent = errorMessage;
      });
  });  

  [emailInput, passwordInput].forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        signInButton.click();
      }
    });
  });

  forgotPasswordButton.addEventListener('click', () => renderHTML("resetPassword.html"));
  createAccountButton.addEventListener('click', () => renderHTML("createAccount.html"));
}

export { setupLoginElements };
