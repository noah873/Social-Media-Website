import { app, auth } from './js/firebase.js'

import {setupLoginElements} from './js/login.js';
import {setupHomeElements} from './js/home.js';

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

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
  }
}

onAuthStateChanged(auth, user => {
  if (user) {
    renderHTML("home.html");
  } else {
    renderHTML("login.html");
  }
});

export {renderHTML};
