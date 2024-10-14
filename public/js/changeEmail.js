import { auth, reauthenticateWithCredential, EmailAuthProvider, updateEmail, db, doc, updateDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupChangeEmailElements() {
  const changeEmailMessageDiv = document.getElementById('changeEmailMessage');
  const changeEmailMessage2Div = document.getElementById('changeEmailMessage2');
  const changeEmailPasswordInput = document.getElementById('changeEmailPassword');
  const changeEmailNewEmailInput = document.getElementById('changeEmailNewEmail');
  const changeEmailChangeEmailButton = document.getElementById('changeEmailChangeEmailButton');
  const changeEmailSettingsButton = document.getElementById('changeEmailSettings');

  changeEmailChangeEmailButton.addEventListener('click', () => {
    const password = changeEmailPasswordInput.value;
    const newEmail = changeEmailNewEmailInput.value;
    
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    const userRef = doc(db, 'users', user.uid);

    reauthenticateWithCredential(user, credential)
        .then(() => {
          if (newEmail === '') {
            changeEmailMessageDiv.textContent = 'Please Enter a New Email';
            return;
          }
          
          updateEmail(user, newEmail)
            .then(() => {
              changeEmailMessageDiv.textContent = 'Email Change Successful';
              changeEmailMessage2Div.textContent = 'An email will be sent to your old email address in case this was a mistake.';
              changeEmailPasswordInput.classList.add('hidden');
              changeEmailNewEmailInput.classList.add('hidden');
              changeEmailChangeEmailButton.classList.add('hidden');

              return updateDoc(userRef, {
                email: newEmail
              })
                .catch(error => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error('Error Changing Email:', error);
              changeEmailMessageDiv.textContent = 'Error Changing Email';
            });
        })
        .catch((error) => {
            console.error('Error during Reauthentication:', error);
            changeEmailMessageDiv.textContent = 'Error during Reauthentication';
        });
  });

  changeEmailPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changeEmailChangeEmailButton.click();
    }
  });

  changeEmailNewEmailInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changeEmailChangeEmailButton.click();
    }
  });
  
  changeEmailSettingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupChangeEmailElements };
