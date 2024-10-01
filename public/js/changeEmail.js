import { auth, reauthenticateWithCredential, EmailAuthProvider, updateEmail, db, doc, updateDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupChangeEmailElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');
  const passwordInput = document.getElementById('password');
  const newEmailInput = document.getElementById('newEmail');
  const changeEmailButton = document.getElementById('changeEmailButton');
  const settingsButton = document.getElementById('settings');

  changeEmailButton.addEventListener('click', () => {
    const password = passwordInput.value;
    const newEmail = newEmailInput.value;
    
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    const userRef = doc(db, 'users', user.uid);

    reauthenticateWithCredential(user, credential)
        .then(() => {
          if (newEmail === '') {
            messageDiv.textContent = 'Please Enter a New Email';
            return;
          }
          
          updateEmail(user, newEmail)
            .then(() => {
              messageDiv.textContent = 'Email Change Successful';
              message2Div.textContent = 'An email will be sent to your old email address in case this was a mistake.';
              passwordInput.classList.add('hidden');
              newEmailInput.classList.add('hidden');
              changeEmailButton.classList.add('hidden');

              return updateDoc(userRef, {
                email: newEmail
              })
                .then(() => {
                })
                .catch(error => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error('Error Changing Email:', error);
              messageDiv.textContent = 'Error Changing Email';
            });
        })
        .catch((error) => {
            console.error('Error during Reauthentication:', error);
            messageDiv.textContent = 'Error during Reauthentication';
        });
  });

  passwordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changeEmailButton.click();
    }
  });

  newEmailInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changeEmailButton.click();
    }
  });
  
  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupChangeEmailElements };
