import { renderHTML } from '../app.js';

function setupChangePasswordElements() {
  const settingsButton = document.getElementById('settings');

  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupChangePasswordElements };
