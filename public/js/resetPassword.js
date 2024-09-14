import { renderHTML } from '../app.js';

function setupResetPasswordElements() {
  const messageDiv = document.getElementById('message');
  const emailInput = document.getElementById('email');
  
  const resetPasswordButton = document.getElementById('resetPasswordButton');
  const loginButton = document.getElementById('login');

  resetPasswordButton.addEventListener('click', () => {
    const email = emailInput.value;
  });

  loginButton.addEventListener('click', () => {
    renderHTML("login.html");
  });
}

export { setupResetPasswordElements };
