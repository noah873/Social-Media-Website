import { app, auth } from './js/firebase.js'
import { renderHTML } from '../app.js';
  
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

function setupCreateAccountElements() {
  const messageDiv = document.getElementById('message');

  const fullNameInput = document.getElementById('fullName');
  const usernameInput = document.getElementById('username');
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const createAccountButton = document.getElementById('createAccountButton');
  const loginButton = document.getElementById('login');
  
  createAccountButton.addEventListener('click', () => {
      const email = emailInput.value;
      const password = passwordInput.value;

      createUserWithEmailAndPassword(auth, email, password)
        .catch(() => {
            messageDiv.textContent = 'Error Creating Account';
        });
  });
  loginButton.addEventListener('click', () => {
    renderHTML("login.html");
  });
}

export { setupCreateAccountElements };
