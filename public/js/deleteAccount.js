import { doc, deleteDoc } from './firebase.js'
import { renderHTML } from '../app.js';

function setupDeleteAccountElements() {
  const messageDiv = document.getElementById('message');
  
  const createAccountButton = document.getElementById('createAccount');
  const deleteAccountButton = document.getElementById('deleteAccountButton');
  const settingsButton = document.getElementById('settings');

  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupDeleteAccountElements };
