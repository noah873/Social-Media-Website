import { auth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from './firebase.js'
import { renderHTML } from '../app.js';

function setupChangePasswordElements() {
  const messageDiv = document.getElementById('message');
  const passwordInput = document.getElementById('password');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
  const changePasswordButton = document.getElementById('changePassword');
  
  const settingsButton = document.getElementById('settings');
  
  changePasswordButton.addEventListener('click', () => {
    const password = passwordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmNewPassword = confirmNewPasswordInput.value;

    if (newPassword !== confirmNewPassword) {
        messageDiv.textContent = 'New Passwords do not Match';
        return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, newPassword)
            .then(() => {
              messageDiv.textContent = 'Password Updated Successfully';
              
              passwordInput.value = '';
              newPasswordInput.value = '';
              confirmNewPasswordInput.value = '';
            })
            .catch((error) => {
              console.error('Error Changing Password:', error);
              messageDiv.textContent = 'Error Changing Password';
            });
        })
        .catch((error) => {
            console.error('Error during Reauthentication:', error);
            messageDiv.textContent = 'Error during Reauthentication';
        });
  });

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      changePasswordButton.click();
    }
  };

  passwordInput.addEventListener('keydown', handleEnterKey);
  newPasswordInput.addEventListener('keydown', handleEnterKey);
  confirmNewPasswordInput.addEventListener('keydown', handleEnterKey);

  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupChangePasswordElements };
