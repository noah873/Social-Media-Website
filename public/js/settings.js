import { auth, signOut } from './firebase.js';
import { renderHTML } from '../app.js';

function setupSettingsElements() {
  const homeButton = document.getElementById('home');
  const signOutButton = document.getElementById('signOut');
  const deleteAccountButton = document.getElementById('deleteAccount');

  homeButton.addEventListener('click', () => {
    renderHTML("home.html");
  });
  
  signOutButton.addEventListener('click', () => {
    signOut(auth)
  });

  deleteAccountButton.addEventListener('click', () => {
    renderHTML("deleteAccount.html");
  });
}

export { setupSettingsElements };
