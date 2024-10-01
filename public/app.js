import { handleAuthStatus } from './js/authStatus.js';

// redirects user to login page if they are not logged in and home page if they are
// also handles online, idle, and offline statuses
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
  } else if (html == "home.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/'); // redirect URL to / (no path)
  } else if (html == "createAccount.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/signup'); // redirect URL
  } else if (html == "settings.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/settings'); // redirect URL
  } else if (html == "resetPassword.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/reset-password'); // redirect URL
  } else if (html == "deleteAccount.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/delete-account'); // redirect URL
  } else if (html == "changePassword.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/change-password'); // redirect URL
  } else if (html == "changeEmail.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/change-email'); // redirect URL
  }
}

export { renderHTML };
