import { auth, signOut, db, doc, onSnapshot, updateDoc, collection, getDocs } from './firebase.js';
import { renderHTML } from '../app.js';

function setupSettingsElements() {
  const settingsMessageDiv = document.getElementById('settingsMessage');
  const settingsFullNameInput = document.getElementById('settingsFullName');
  const settingsChangeFullNameButton = document.getElementById('settingsChangeFullName');

  const settingsMessage2Div = document.getElementById('settingsMessage2');
  const settingsUsernameInput = document.getElementById('settingsUsername');
  const settingsChangeUsernameButton = document.getElementById('settingsChangeUsername');
  
  const settingsChangeEmailButton = document.getElementById('settingsChangeEmail');
  const settingsChangePasswordButton = document.getElementById('settingsChangePassword');
  const settingsSignOutButton = document.getElementById('settingsSignOut');
  const settingsDeleteAccountButton = document.getElementById('settingsDeleteAccount');

  const user = auth.currentUser;
  const userRef = doc(db, 'users', user.uid);

  onSnapshot(userRef,
    (doc) => {
      const data = doc.data();
      settingsMessageDiv.textContent = 'Full Name: ' + data.full_name;
    },
    (error) => {
      console.error("Error Fetching Document:", error);
      settingsMessageDiv.textContent = 'Error Displaying Full Name';
    }
  );

  onSnapshot(userRef,
    (doc) => {
      const data = doc.data();
      settingsMessage2Div.textContent = 'Username: ' + data.username;
    },
    (error) => {
      console.error("Error Fetching Document:", error);
      settingsMessage2Div.textContent = 'Error Displaying Username';
    }
  );

  settingsChangeFullNameButton.addEventListener('click', () => {
    const fullName = settingsFullNameInput.value;

    if (fullName === '') {
      settingsMessageDiv.textContent = 'Full Name: cannot be Empty';
      return;
    }
    
    return updateDoc(userRef, {
      full_name: fullName
    })
      .then(() => {
        settingsFullNameInput.value = '';
      })
      .catch(error => {
        console.error(error);
        settingsMessageDiv.textContent = 'Error Changing Full Name';
      });
  });

  settingsFullNameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      settingsChangeFullNameButton.click();
    }
  });
  
  settingsChangeUsernameButton.addEventListener('click', () => {
    const username = settingsUsernameInput.value;

    if (username === '') {
      settingsMessage2Div.textContent = 'Username: cannot be Empty';
      return;
    }

    getDocs(collection(db, 'users'))
      .then(currentUsers => {
        const takenUsernames = currentUsers.docs.map(doc => doc.data().username);
  
        if (takenUsernames.includes(username)) {
          settingsMessage2Div.textContent = 'Username Already Taken';
          return;
        }
  
        return updateDoc(userRef, {
          username: username
        })
          .then(() => {
            settingsUsernameInput.value = '';
          })
          .catch(error => {
            console.error(error);
            settingsMessage2Div.textContent = 'Error Changing Username';
          });
      })
      .catch((error) => {
        console.error('Error Querying Database: ', error);
        settingsMessage2Div.textContent = 'Error Validating Username';
      });
  });

  settingsUsernameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      settingsChangeUsernameButton.click();
    }
  });

  settingsChangeEmailButton.addEventListener('click', () => {
    renderHTML("changeEmail.html");
  });

  settingsChangePasswordButton.addEventListener('click', () => {
    renderHTML("changePassword.html");
  });
  
  settingsSignOutButton.addEventListener('click', () => {
    signOut(auth)
  });

  settingsDeleteAccountButton.addEventListener('click', () => {
    renderHTML("deleteAccount.html");
  });
}

export { setupSettingsElements };
