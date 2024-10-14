import { auth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from './firebase.js'
import { renderHTML } from '../app.js';

function setupChangePasswordElements() {
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
    renderHTML("settings.html");
  });
}

export { setupChangePasswordElements };
