import { auth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, db, doc, deleteDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupDeleteAccountElements() {
  const deleteAccountDiv = document.getElementById('deleteAccount');
  
  const deleteAccountMessageDiv = document.getElementById('deleteAccountMessage');
  const deleteAccountMessage2Div = document.getElementById('deleteAccountMessage2');

  const deleteAccountPasswordInput = document.getElementById('deleteAccountPassword');
  const deleteAccountDeleteAccountButton = document.getElementById('deleteAccountDeleteAccountButton');
  const deleteAccountSettingsButton = document.getElementById('deleteAccountSettings');

  deleteAccountDeleteAccountButton.addEventListener('click', async () => {
    const password = deleteAccountPasswordInput.value;
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
              deleteAccountMessageDiv.textContent = 'Account and Data Deletion Successful';
              deleteAccountMessage2Div.textContent = 'Refresh the page to return to login screen.';
              deleteAccountPasswordInput.classList.add('hidden');
              deleteAccountDeleteAccountButton.classList.add('hidden');
              deleteAccountSettingsButton.classList.add('hidden');
            })
            .catch((error) => {
              console.error('Error Deleting Account', error);
              deleteAccountMessageDiv.textContent = 'Error Deleting Account';
              deleteAccountMessage2Div.textContent = '';
            });
        })
        .catch((error) => {
            console.error('Error during Reauthentication:', error);
            deleteAccountMessageDiv.textContent = 'Error during Reauthentication';
        });
  });

  deleteAccountPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      deleteAccountDeleteAccountButton.click();
    }
  });
  
  deleteAccountSettingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupDeleteAccountElements };
