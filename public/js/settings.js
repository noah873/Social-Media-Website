import { auth, signOut, reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword, deleteUser, db, doc, onSnapshot, updateDoc, collection, getDocs, deleteDoc, query, where } from './firebase.js';

function setupSettingsElements() {
  const settingsMessageDiv = document.getElementById('settingsMessage');
  const fullNameMessageDiv = document.getElementById('fullNameMessage');
  const settingsFullNameInput = document.getElementById('settingsFullName');
  const settingsChangeFullNameButton = document.getElementById('settingsChangeFullName');

  const settingsMessage2Div = document.getElementById('settingsMessage2');
  const usernameMessageDiv = document.getElementById('usernameMessage');
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

    if (!fullName) {
      fullNameMessageDiv.textContent = 'Please fill in this field and try again.';
      return;
    }
    
    return updateDoc(userRef, {
      full_name: fullName
    })
      .then(() => {
        fullNameMessageDiv.textContent = '';
        settingsFullNameInput.value = '';
      })
      .catch(error => {
        console.error(error);
        fullNameMessageDiv.textContent = 'Error Changing Full Name';
      });
  });

  settingsFullNameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      settingsChangeFullNameButton.click();
    }
  });
  
  settingsChangeUsernameButton.addEventListener('click', () => {
    const username = settingsUsernameInput.value;

    if (!username) {
      usernameMessageDiv.textContent = 'Please fill in this field and try again.';
      return;
    }

    getDocs(collection(db, 'users'))
      .then(currentUsers => {
        const takenUsernames = currentUsers.docs.map(doc => doc.data().username);
  
        if (takenUsernames.includes(username)) {
          usernameMessageDiv.textContent = 'Username Already Taken. Please try again.';
          return;
        }
  
        return updateDoc(userRef, {
          username: username
        })
          .then(() => {
            usernameMessageDiv.textContent = '';
            settingsUsernameInput.value = '';
          })
          .catch(error => {
            console.error(error);
            usernameMessageDiv.textContent = 'Error Changing Username';
          });
      })
      .catch((error) => {
        console.error('Error Querying Database: ', error);
        usernameMessageDiv.textContent = 'Error Validating Username';
      });
  });

  settingsUsernameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      settingsChangeUsernameButton.click();
    }
  });

  settingsChangeEmailButton.addEventListener('click', () => {
    changeEmailMessageDiv.textContent = "Update your Email";
    changeEmailMessage2Div.textContent = '';

    changeEmailPasswordInput.value = '';
    changeEmailNewEmailInput.value = '';
    
    changeEmailPasswordInput.classList.remove('hidden');
    changeEmailNewEmailInput.classList.remove('hidden');
    changeEmailButton.classList.remove('hidden');

    changeEmailPopup.classList.remove('hidden');
  });

  settingsChangePasswordButton.addEventListener('click', () => {
    changePasswordMessageDiv.textContent = "Update your Password";
    changePasswordMessage2Div.textContent = '';

    changePasswordPasswordInput.value = '';
    changePasswordNewPasswordInput.value = '';
    changePasswordConfirmNewPasswordInput.value = '';

    changePasswordPasswordInput.classList.remove('hidden');
    changePasswordNewPasswordInput.classList.remove('hidden');
    changePasswordConfirmNewPasswordInput.classList.remove('hidden');
    changePasswordButton.classList.remove('hidden');

    changePasswordPopup.classList.remove('hidden');
  });
  
  settingsSignOutButton.addEventListener('click', () => {
    signOut(auth)
  });

  settingsDeleteAccountButton.addEventListener('click', () => {
    deleteAccountMessageDiv.textContent = "Account and Data Deletion";

    deleteAccountPasswordInput.value = '';
    
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
  const changeEmailButton = document.getElementById('changeEmailButton');
  const closeChangeEmailPopupButton = document.getElementById('closeChangeEmailPopup');

  changeEmailButton.addEventListener('click', () => {
    const password = changeEmailPasswordInput.value;
    const newEmail = changeEmailNewEmailInput.value;

    if (!password || !newEmail) {
      changeEmailMessage2Div.textContent = 'Please fill in all fields and try again.';
      return;
    }
    
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
              changeEmailButton.classList.add('hidden');

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

  [changeEmailPasswordInput, changeEmailNewEmailInput].forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        changeEmailButton.click();
      }
    });
  });
  
  closeChangeEmailPopupButton.addEventListener('click', () => changeEmailPopup.classList.add('hidden'));

  // Change Password Popup
  const changePasswordMessageDiv = document.getElementById('changePasswordMessage');
  const changePasswordMessage2Div = document.getElementById('changePasswordMessage2');
  const changePasswordPasswordInput = document.getElementById('changePasswordPassword');
  const changePasswordNewPasswordInput = document.getElementById('changePasswordNewPassword');
  const changePasswordConfirmNewPasswordInput = document.getElementById('changePasswordConfirmNewPassword');
  const changePasswordButton = document.getElementById('changePasswordButton');
  
  const closeChangePasswordPopupButton = document.getElementById('closeChangePasswordPopup');
  
  changePasswordButton.addEventListener('click', () => {
    const password = changePasswordPasswordInput.value;
    const newPassword = changePasswordNewPasswordInput.value;
    const confirmNewPassword = changePasswordConfirmNewPasswordInput.value;

    if (!password || !newPassword) {
      changePasswordMessage2Div.textContent = 'Please fill in all fields and try again.';
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      changePasswordMessage2Div.textContent = 'New Passwords do not Match. Please try again.';
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

              changePasswordMessage2Div.classList.add('hidden');
              changePasswordPasswordInput.classList.add('hidden');
              changePasswordNewPasswordInput.classList.add('hidden');
              changePasswordConfirmNewPasswordInput.classList.add('hidden');
              changePasswordButton.classList.add('hidden');
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

  [changePasswordPasswordInput, changePasswordNewPasswordInput, changePasswordConfirmNewPasswordInput].forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        changePasswordButton.click();
      }
    });
  });

  closeChangePasswordPopupButton.addEventListener('click', () => changePasswordPopup.classList.add('hidden'));

  // Delete Account Popup
  const deleteAccountDiv = document.getElementById('deleteAccount');
  
  const deleteAccountMessageDiv = document.getElementById('deleteAccountMessage');
  const deleteAccountMessage2Div = document.getElementById('deleteAccountMessage2');

  const deleteAccountPasswordInput = document.getElementById('deleteAccountPassword');
  const deleteAccountButton = document.getElementById('deleteAccountButton');
  const closeDeleteAccountPopupButton = document.getElementById('closeDeleteAccountPopup');

  deleteAccountButton.addEventListener('click', async () => {
    const password = deleteAccountPasswordInput.value;

    if (!password) {
      deleteAccountMessage2Div.textContent = 'Please fill in this field and try again.';
      return;
    }
    
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credential)
      .then(() => {
        const posts = collection(db, 'posts');
        const q = query(posts, where('userID', '==', user.uid));
        return getDocs(q);
      })
      .then((querySnapshot) => {
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
          deletePromises.push(deleteDoc(doc.ref));
        });
        return Promise.all(deletePromises);
      })
      .then(() => {
        return deleteDoc(doc(db, 'users', user.uid))
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
            deleteAccountButton.classList.add('hidden');
          })
          .catch((error) => {
            console.error('Error Deleting Account', error);
            deleteAccountMessageDiv.textContent = 'Error Deleting Account';
            deleteAccountMessage2Div.textContent = '';
          });
        })
        .catch((error) => {
            console.error('Error Deleting Account:', error);
            deleteAccountMessageDiv.textContent = 'Error Deleting Account';
        });
  });

  deleteAccountPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      deleteAccountButton.click();
    }
  });
  
  closeDeleteAccountPopupButton.addEventListener('click', () => deleteAccountPopup.classList.add('hidden'));
}

export { setupSettingsElements };
