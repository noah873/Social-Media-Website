import { renderHTML } from '../app.js';

function setupNavbarElements() {
  const navHomeButton = document.getElementById('navHome');
  const navMessagesButton = document.getElementById('navMessages');
  const navPostButton = document.getElementById('navPost');
  const navSettingsButton = document.getElementById('navSettings');
  
  navSettingsButton.style.backgroundColor = '#0056b3';
  
  navHomeButton.addEventListener('click', () => {
    renderHTML("home.html");
  });
  
  navMessagesButton.addEventListener('click', () => {
    renderHTML("messages.html");
  });
  
  navPostButton.addEventListener('click', () => {
    renderHTML("home.html");
  });
  
  navSettingsButton.addEventListener('click', () => {
    renderHTML("settings.html");
  });
}

export { setupNavbarElements };
