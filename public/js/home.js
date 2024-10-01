import { renderHTML } from '../app.js';

const settingsButton = document.getElementById('settings');

settingsButton.addEventListener('click', () => {
  renderHTML("settings.html");
});
