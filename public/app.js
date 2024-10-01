import { handleAuthStatus } from './js/authStatus.js';

import { setupLoginElements } from './js/login.js';
import { setupHomeElements } from './js/home.js';
import { setupCreateAccountElements } from './js/createAccount.js';
import { setupSettingsElements } from './js/settings.js';
import { setupResetPasswordElements } from './js/resetPassword.js';
import { setupDeleteAccountElements } from './js/deleteAccount.js';
import { setupChangePasswordElements } from './js/changePassword.js';
import { setupChangeEmailElements } from './js/changeEmail.js';

// redirects viewer to login page if not logged in and home page if they are
// handles online, idle, and offline statuses
// ensures firestore stores the user's correct email in the event of an email revert
handleAuthStatus();

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
  } else if (html == "changeEmail.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/change-email'); // redirect URL
    setupChangeEmailElements();
  }
}

export { renderHTML };
