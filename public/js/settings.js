import { auth, signOut, db, doc, onSnapshot, updateDoc } from './firebase.js';
import { renderHTML } from '../app.js';

function setupSettingsElements() {
  const homeButton = document.getElementById('home');

  const messageDiv = document.getElementById('message');
  const fullNameInput = document.getElementById('fullName');
  const changeFullNameButton = document.getElementById('changeFullName');

  const message2Div = document.getElementById('message2');
  const usernameInput = document.getElementById('username');
  const changeUsernameButton = document.getElementById('changeUsername');
  
  const changeEmailButton = document.getElementById('changeEmail');
  const changePasswordButton = document.getElementById('changePassword');
  const signOutButton = document.getElementById('signOut');
  const deleteAccountButton = document.getElementById('deleteAccount');

  const user = auth.currentUser;
  const userRef = doc(db, 'users', user.uid);
  
  homeButton.addEventListener('click', () => {
    renderHTML("home.html");
  });

  onSnapshot(userRef, (doc) => {
    const data = doc.data();
    messageDiv.textContent = 'Full Name: ' + data.fullName;
  });

  onSnapshot(userRef, (doc) => {
    const data = doc.data();
    message2Div.textContent = 'Username: ' + data.username;
  });

  changeFullNameButton.addEventListener('click', () => {
    const fullName = fullNameInput.value;

    if (fullName === '') {
      messageDiv.textContent = 'Full Name cannot be Empty';
      return;
    }
    
    return updateDoc(userRef, {
      fullName: fullName
    }).then(() => {
      fullNameInput.value = '';
    }).catch(error => {
      console.error(error);
      messageDiv.textContent = 'Error Changing Full Name';
    });
  });
  
  changeUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value;

    if (username === '') {
      message2Div.textContent = 'Username cannot be Empty';
      return;
    }
    
    return updateDoc(userRef, {
      username: username
    }).then(() => {
      usernameInput.value = '';
    }).catch(error => {
      console.error(error);
      message2Div.textContent = 'Error Changing Username';
    });
  });

  changePasswordButton.addEventListener('click', () => {
    renderHTML("changePassword.html");
  });
  
  signOutButton.addEventListener('click', () => {
    signOut(auth)
  });

  deleteAccountButton.addEventListener('click', () => {
    renderHTML("deleteAccount.html");
  });
}

export { setupSettingsElements };
