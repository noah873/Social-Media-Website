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

    try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        messageDiv.textContent = 'Password Updated Successfully';
        passwordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';
    } catch (error) {
        console.error(error);
        messageDiv.textContent = 'Error Changing Password';
    }
  });

  passwordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changePasswordButton.click();
    }
  });

  newPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changePasswordButton.click();
    }
  });

  confirmNewPasswordInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      changePasswordButton.click();
    }
  });

  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupChangePasswordElements };
