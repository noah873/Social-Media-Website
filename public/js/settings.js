import { auth, signOut, reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword, deleteUser, db, doc, onSnapshot, updateDoc, collection, getDocs, deleteDoc } from './firebase.js';

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
    changeEmailPopup.classList.remove('hidden');
    
    changeEmailPasswordInput.classList.remove('hidden');
    changeEmailNewEmailInput.classList.remove('hidden');
    changeEmailChangeEmailButton.classList.remove('hidden');
  });

  settingsChangePasswordButton.addEventListener('click', () => {
    changePasswordPopup.classList.remove('hidden');

    changePasswordPasswordInput.classList.remove('hidden');
    changePasswordNewPasswordInput.classList.remove('hidden');
    changePasswordConfirmNewPasswordInput.classList.remove('hidden');
    changePasswordChangePasswordButton.classList.remove('hidden');
  });
  
  settingsSignOutButton.addEventListener('click', () => {
    signOut(auth)
  });

  settingsDeleteAccountButton.addEventListener('click', () => {
    deleteAccountPopup.classList.remove('hidden');
  });

  // Popup Functionalities
  const changeEmailPopup = document.getElementById('changeEmailPopup');
  const changePasswordPopup = document.getElementById('changePasswordPopup');
  const deleteAccountPopup = document.getElementById('deleteAccountPopup');

  changeEmailPopup.addEventListener('click', function() {
    if (event.target === this) {
      changeEmailPopup.classList.add('hidden');
    }
  });

  changePasswordPopup.addEventListener('click', function() {
    if (event.target === this) {
      changePasswordPopup.classList.add('hidden');
    }
  });

  deleteAccountPopup.addEventListener('click', deleteAccountPopupClick);

  function deleteAccountPopupClick() {
    if (event.target === this) {
        deleteAccountPopup.classList.add('hidden');
    }
  }

  // Change Email Popup
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
    changeEmailPopup.classList.add('hidden');
  });

  // Change Password Popup
  const changePasswordMessageDiv = document.getElementById('changePasswordMessage');
  const changePasswordPasswordInput = document.getElementById('changePasswordPassword');
  const changePasswordNewPasswordInput = document.getElementById('changePasswordNewPassword');
  const changePasswordConfirmNewPasswordInput = document.getElementById('changePasswordConfirmNewPassword');
  const changePasswordChangePasswordButton = document.getElementById('changePasswordChangePasswordButton');
  
  const changePasswordSettingsButton = document.getElementById('changePasswordSettings');
  
  changePasswordChangePasswordButton.addEventListener('click', () => {
    const password = changePasswordPasswordInput.value;
    const newPassword = changePasswordNewPasswordInput.value;
    const confirmNewPassword = changePasswordConfirmNewPasswordInput.value;
    
    if (newPassword !== confirmNewPassword) {
        changePasswordMessageDiv.textContent = 'New Passwords do not Match';
        return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credential)
        .then(() => {
          if (newPassword === '') {
            changePasswordMessageDiv.textContent = 'Please Fill Out all Forms';
            return;
          }
          
          updatePassword(user, newPassword)
            .then(() => {
              changePasswordMessageDiv.textContent = 'Password Updated Successfully';
              
              changePasswordPasswordInput.classList.add('hidden');
              changePasswordNewPasswordInput.classList.add('hidden');
              changePasswordConfirmNewPasswordInput.classList.add('hidden');
              changePasswordChangePasswordButton.classList.add('hidden');
            })
            .catch((error) => {
              console.error('Error Changing Password:', error);
              changePasswordMessageDiv.textContent = 'Error Changing Password';
            });
        })
        .catch((error) => {
            console.error('Error during Reauthentication:', error);
            changePasswordMessageDiv.textContent = 'Error during Reauthentication';
        });
  });

  changePasswordPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changePasswordChangePasswordButton.click();
    }
  });

  changePasswordNewPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changePasswordChangePasswordButton.click();
    }
  });

  changePasswordConfirmNewPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changePasswordChangePasswordButton.click();
    }
  });

  changePasswordSettingsButton.addEventListener('click', () => {
    changePasswordPopup.classList.add('hidden');
  });

  // Delete Account Popup
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
              deleteAccountPopup.style.backgroundColor = 'white';
              deleteAccountPopup.removeEventListener('click', deleteAccountPopupClick);
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
    deleteAccountPopup.classList.add('hidden');
  });
}

export { setupSettingsElements };
