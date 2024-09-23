import { auth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, db, doc, deleteDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupDeleteAccountElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');

  const passwordInput = document.getElementById('password');
  const deleteAccountButton = document.getElementById('deleteAccountButton');
  const settingsButton = document.getElementById('settings');

  deleteAccountButton.addEventListener('click', async () => {
    const password = passwordInput.value;
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credential)
        .then(() => {
          return deleteDoc(doc(db, 'users', user.uid));
        })
        .then(() => {
          messageDiv.textContent = 'Data Deletion Successful';
          message2Div.textContent = 'Attempting to Delete Account now, you will automatically be redirected to the login page if successful.';
          passwordInput.classList.add('hidden');
          deleteAccountButton.classList.add('hidden');
          settingsButton.classList.add('hidden');
      
          setTimeout(function() {
            const currentUser = auth.currentUser;
            deleteUser(currentUser)
              .catch((error) => {
                console.error('Error Deleting Account', error);
                messageDiv.textContent = 'Error Deleting Account';
                message2Div.textContent = '';
              });
          }, 10000);
        })
        .catch((error) => {
            console.error('Error during Reauthentication:', error);
            messageDiv.textContent = 'Error during Reauthentication';
        });
  });

  passwordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      deleteAccountButton.click();
    }
  });
  
  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupDeleteAccountElements };
