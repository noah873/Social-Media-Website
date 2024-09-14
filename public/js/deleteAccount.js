import { auth, deleteUser, doc, deleteDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupDeleteAccountElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');
  
  const deleteAccountButton = document.getElementById('deleteAccountButton');
  const settingsButton = document.getElementById('settings');

  deleteAccountButton.addEventListener('click', () => {
    const user = userCredential.user;
    return deleteDoc(doc(db, 'users', user.uid);

    messageDiv.textContent = 'Data Deletion Successful';
    message2Div.textContent = 'Attempting to Delete Account now, you will automatically be redirectly to the login page if successful.';

    setTimeout(function() {
      const currentUser = auth.currentUser;
      deleteUser(currentUser)
        .catch((error) => {
          console.error('Error Deleting Account', error);
          messageDiv.textContent = 'Error Deleting Account';
          message2Div.textContent = '';
        });
    }, 5000);
    
  });
  
  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupDeleteAccountElements };
