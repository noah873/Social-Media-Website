import { renderHTML } from '../app.js';

function setupHomeElements() {
  const settingsButton = document.getElementById('settings');
  
  settingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupHomeElements };
