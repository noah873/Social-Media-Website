import { auth, reauthenticateWithCredential, EmailAuthProvider, updateEmail, sendEmailVerification } from './firebase.js'
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

    reauthenticateWithCredential(user, credential)
        .then(() => {
          sendEmailVerification(user)
            .then(() => {
              updateEmail(user, newEmail)
                .then(() => {
                  messageDiv.textContent = 'Email Change Successful';
                  message2Div.textContent = 'An email will be sent to your old email in case this was a mistake.';
                  passwordInput.value = '';
                  newEmailInput.value = '';
                })
                .catch((error) => {
                    console.error('Error Changing Email:', error);
                    messageDiv.textContent = 'Error Changing Email';
                });
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
