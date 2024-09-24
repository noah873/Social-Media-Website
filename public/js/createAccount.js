import { app, auth, createUserWithEmailAndPassword, db, doc, setDoc, collection, getDocs } from './firebase.js'
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

    const currentUsers = await getDocs(collection(db, 'users'));
    const takenUsernames = currentUsers.docs.map(doc => doc.data().username);

    if (takenUsernames.includes(username)) {
      messageDiv.textContent = 'Username Already Taken';
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        
        return setDoc(userRef, {
          email: email,
          full_name: fullName,
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
