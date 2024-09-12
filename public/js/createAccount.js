import { app, auth, createUserWithEmailAndPassword, db, doc, setDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupCreateAccountElements() {
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
      .then((/*userCredential*/) => {
        //const user = userCredential.user;
          
        return setDoc(doc(db, 'users', user.uid), {
          email: email,
          fullName: fullName,
          username: username
        });
      })
      .catch((error) => {
        console.error('Error Creating Account and/or Writing Data: ', error);
        messageDiv.textContent = 'Error Creating Account';
      });
    });
    
    loginButton.addEventListener('click', () => {
      renderHTML("login.html");
    });
}

export { setupCreateAccountElements };
