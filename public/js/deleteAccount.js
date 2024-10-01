import { auth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, db, doc, deleteDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupDeleteAccountElements() {
  const deleteAccountDiv = document.getElementById('deleteAccount');
  
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
          const currentUser = auth.currentUser;
          // serves as a flag to prevent redirection to login page
          sessionStorage.setItem('deletingAccount', 'true');
          deleteUser(currentUser)
            .then(() => {
              deleteAccountDiv.style.width = '25%';
              messageDiv.textContent = 'Account and Data Deletion Successful';
              message2Div.textContent = 'Refresh the page to return to login screen.';
              passwordInput.classList.add('hidden');
              deleteAccountButton.classList.add('hidden');
              settingsButton.classList.add('hidden');
            })
            .catch((error) => {
              console.error('Error Deleting Account', error);
              messageDiv.textContent = 'Error Deleting Account';
              message2Div.textContent = '';
            });
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
