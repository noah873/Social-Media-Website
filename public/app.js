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

// updates online_status field
function updateUserStatus(user, isOnline) {
  const userRef = doc(db, 'users', user.uid);
  return updateDoc(userRef, {
      online_status: isOnline
  });
}

function handleVisibilityChange() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    if (document.hidden) {
      updateUserStatus(currentUser, false);
    } else {
      updateUserStatus(currentUser, true);
    }
  }
}

function handleBeforeUnload() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    updateUserStatus(currentUser, false);
  }
}

// triggered when a user signs in or out
onAuthStateChanged(auth, user => {
  if (user) {
    renderHTML("home.html");

    // set user as online after they login, create and account, or visit a page while logged in
    updateUserStatus(user, true);

    // update user status when they switch tabs or minimize window
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // set user to not online if they close the tab (while still logged in)
    window.addEventListener('beforeunload', handleBeforeUnload);

    // set user to not online if they sign out
    auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        updateUserStatus(user, false);
        // remove event listeners after logout
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    });
  } else {
    renderHTML("login.html");
  }
});

export { renderHTML };
