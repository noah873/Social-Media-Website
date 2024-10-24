import { auth, sendPasswordResetEmail } from './firebase.js';
import { renderHTML } from '../app.js';

function setupResetPasswordElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');
  const emailInput = document.getElementById('email');
  
  const resetPasswordButton = document.getElementById('resetPasswordButton');
  const loginButton = document.getElementById('login');

  resetPasswordButton.addEventListener('click', () => {
    const email = emailInput.value;

    if (!email) {
      message2Div.textContent = 'Please fill in this field and try again.';
      return;
    }
    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        messageDiv.textContent = 'Reset Email Successfully Sent';
        message2Div.classList.add('hidden');
        emailInput.classList.add('hidden');
        resetPasswordButton.classList.add('hidden');
      })
      .catch((error) => {
        console.error('Error sending password reset email: ', error);
        messageDiv.textContent = 'Error Sending Reset Email';

        let errorMessage = error.message; // sample input: " Firebase: Password should be at least 6 characters (auth/weak-password)."
        errorMessage = errorMessage.trim().split(" "); // removes excess spaces and splits into array
        errorMessage[errorMessage.length - 1] = errorMessage[errorMessage.length - 1].replace("auth/", ""); // changes last element "(auth/weak-password)." to "(weak-password)."
        errorMessage = errorMessage.slice(1, errorMessage.length); // slices off first element in array
        errorMessage = errorMessage.join(" ") + " Please try again."; // rejoins array into string
        message2Div.textContent = errorMessage;
      });
  });

  emailInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') resetPasswordButton.click();
  });

  loginButton.addEventListener('click', () => renderHTML("login.html"));
}

export { setupResetPasswordElements };
