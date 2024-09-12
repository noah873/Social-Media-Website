import { auth, signOut } from './firebase.js';

function setupHomeElements() {
  const signOutButton = document.getElementById('signOut');
  
  signOutButton.addEventListener('click', () => {
    signOut(auth)
  });
}

export {setupHomeElements};
