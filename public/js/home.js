import { app, auth } from 'firebase.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

function setupHomeElements() {
  const signOutButton = document.getElementById('signOut');
  
  signOutButton.addEventListener('click', () => {
    signOut(auth)
  });
}

export {setupHomeElements};
