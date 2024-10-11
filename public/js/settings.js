import { auth, signOut, db, doc, onSnapshot, updateDoc, collection, getDocs } from './firebase.js';
import { renderHTML } from '../app.js';

function setupSettingsElements() {
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

  onSnapshot(userRef,
    (doc) => {
      const data = doc.data();
      messageDiv.textContent = 'Full Name: ' + data.full_name;
    },
    (error) => {
      console.error("Error Fetching Document:", error);
      messageDiv.textContent = 'Error Displaying Full Name';
    }
  );

  onSnapshot(userRef,
    (doc) => {
      const data = doc.data();
      message2Div.textContent = 'Username: ' + data.username;
    },
    (error) => {
      console.error("Error Fetching Document:", error);
      message2Div.textContent = 'Error Displaying Username';
    }
  );

  changeFullNameButton.addEventListener('click', () => {
    const fullName = fullNameInput.value;

    if (fullName === '') {
      messageDiv.textContent = 'Full Name: cannot be Empty';
      return;
    }
    
    return updateDoc(userRef, {
      full_name: fullName
    })
      .then(() => {
        fullNameInput.value = '';
      })
      .catch(error => {
        console.error(error);
        messageDiv.textContent = 'Error Changing Full Name';
      });
  });

  fullNameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changeFullNameButton.click();
    }
  });
  
  changeUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value;

    if (username === '') {
      message2Div.textContent = 'Username: cannot be Empty';
      return;
    }

    getDocs(collection(db, 'users'))
      .then(currentUsers => {
        const takenUsernames = currentUsers.docs.map(doc => doc.data().username);
  
        if (takenUsernames.includes(username)) {
          message2Div.textContent = 'Username Already Taken';
          return;
        }
  
        return updateDoc(userRef, {
          username: username
        })
          .then(() => {
            usernameInput.value = '';
          })
          .catch(error => {
            console.error(error);
            message2Div.textContent = 'Error Changing Username';
          });
      })
      .catch((error) => {
        console.error('Error Querying Database: ', error);
        message2Div.textContent = 'Error Validating Username';
      });
  });

  usernameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changeUsernameButton.click();
    }
  });

  changeEmailButton.addEventListener('click', () => {
    renderHTML("changeEmail.html");
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
