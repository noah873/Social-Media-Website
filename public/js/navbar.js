import { renderHTML } from '../app.js';

function setupNavbarElements() {
  const navHomeButton = document.getElementById('navHome');
  const navMessagesButton = document.getElementById('navMessages');
  const navPostButton = document.getElementById('navPost');
  const navSettingsButton = document.getElementById('navSettings');
  
  navHomeButton.classList.add('active');
  
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
