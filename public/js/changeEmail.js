import { auth, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from './firebase.js'
import { renderHTML } from '../app.js';

function setupChangeEmailElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');
  const passwordInput = document.getElementById('password');
  const newEmailInput = document.getElementById('newEmail');
  const changeEmailButton = document.getElementById('changeEmailButton');
  const settingsButton = document.getElementById('settings');

  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupChangeEmailElements };
