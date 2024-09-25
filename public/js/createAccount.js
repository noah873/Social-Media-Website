import { app, auth, createUserWithEmailAndPassword, db, doc, setDoc, collection, getDocs } from './firebase.js'
import { renderHTML } from '../app.js';

function setupCreateAccountElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');

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

    if (fullName === '') {
      message2Div.textContent = 'Please enter a full name.';
      return;
    }

    if (username === '') {
      message2Div.textContent = 'Please enter a username.';
      return;
    }
  
    getDocs(collection(db, 'users'))
      .then(currentUsers => {
        const takenUsernames = currentUsers.docs.map(doc => doc.data().username);
  
        if (takenUsernames.includes(username)) {
          message2Div.textContent = 'Username already taken. Please try again.';
          return;
        }
  
        return createUserWithEmailAndPassword(auth, email, password)
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
            console.error('Error Creating Account: ', error);
            messageDiv.textContent = 'Error Creating Account';

            let errorMessage = error.message;
            errorMessage = errorMessage.trim().split(" ");
            errorMessage = errorMessage.slice(1, errorMessage.length - 1);
            errorMessage = errorMessage.join(" ") + ". Please try again.";
            messageDiv2.textContent = errorMessage;
          });
      })
      .catch((error) => {
        console.error('Error Querying Database: ', error);
        message2Div.textContent = 'Error querying database to validate username. Please try again.';
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
