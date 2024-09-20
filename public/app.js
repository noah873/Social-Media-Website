import { auth, onAuthStateChanged, db, doc, updateDoc } from './js/firebase.js'

import { setupLoginElements } from './js/login.js';
import { setupHomeElements } from './js/home.js';
import { setupCreateAccountElements } from './js/createAccount.js';
import { setupSettingsElements } from './js/settings.js';
import { setupResetPasswordElements } from './js/resetPassword.js';
import { setupDeleteAccountElements } from './js/deleteAccount.js';
import { setupChangePasswordElements } from './js/changePassword.js';

async function loadHTML(html) {
  const response = await fetch(`html/${html}`);
  return await response.text();
}

async function renderHTML(html) {
  const app = document.getElementById('app');
  
  if (html == "login.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/login');  // redirect URL
    setupLoginElements();
  } else if (html == "home.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/'); // redirect URL to / (no path)
    setupHomeElements();
  } else if (html == "createAccount.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/signup'); // redirect URL
    setupCreateAccountElements();
  } else if (html == "settings.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/settings'); // redirect URL
    setupSettingsElements();
  } else if (html == "resetPassword.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/reset-password'); // redirect URL
    setupResetPasswordElements();
  } else if (html == "deleteAccount.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/delete-account'); // redirect URL
    setupDeleteAccountElements();
  } else if (html == "changePassword.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/change-password'); // redirect URL
    setupChangePasswordElements();
  }
}

onAuthStateChanged(auth, user => {
  if (user) {
    renderHTML("home.html");

    const userRef = doc(db, 'users', user.uid);
    return updateDoc(userRef, {
      online_status: true
    });

    window.addEventListener('beforeunload', async () => {
      return updateDoc(userRef, {
        online_status: false
      });
    });
    
  } else {
    renderHTML("login.html");
  }
});

export { renderHTML };
