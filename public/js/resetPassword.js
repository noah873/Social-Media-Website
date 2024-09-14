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
    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        messageDiv.textContent = 'Reset Email Successfully Sent';
        message2Div.textContent = '';
      })
      .catch((error) => {
        console.error('Error sending password reset email: ', error);
        messageDiv.textContent = 'Error Sending Reset Email';
      });
  });

  emailInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      resetPasswordButton.click();
    }
  });

  loginButton.addEventListener('click', () => {
    renderHTML("login.html");
  });
}

export { setupResetPasswordElements };
