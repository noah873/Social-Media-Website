import { auth, signOut } from './firebase.js';
import { renderHTML } from '../app.js';

function setupSettingsElements() {
  const homeButton = document.getElementById('home');
  const signOutButton = document.getElementById('signOut');

  homeButton.addEventListener('click', () => {
    renderHTML("home.html");
  });
  
  signOutButton.addEventListener('click', () => {
    signOut(auth)
  });
}

export { setupSettingsElements };
