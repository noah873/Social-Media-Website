import { app, auth, createUserWithEmailAndPassword, db, doc, setDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupCreateAccountElements() {
  // allows user to sign in after deleting account in same session
  sessionStorage.setItem('accountDeleted', 'false');
  
  const messageDiv = document.getElementById('message');

  const fullNameInput = document.getElementById('fullName');
  const usernameInput = document.getElementById('username');
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const createAccountButton = document.getElementById('createAccountButton');
  const loginButton = document.getElementById('login');
  
  createAccountButton.addEventListener('click', () => {
    const fullName = fullNameInput.value;
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        
        return setDoc(userRef, {
          email: email,
          fullName: fullName,
          username: username,
          online_status: true
        });
      })
      .catch((error) => {
        console.error('Error Creating Account and/or Writing Data: ', error);
        messageDiv.textContent = 'Error Creating Account';
      });
    });

    fullNameInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        createAccountButton.click();
      }
    });

    usernameInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        createAccountButton.click();
      }
    });

    emailInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        createAccountButton.click();
      }
    });

    passwordInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        createAccountButton.click();
      }
    });
    
    loginButton.addEventListener('click', () => {
      renderHTML("login.html");
    });
}

export { setupCreateAccountElements };
