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
    history.pushState({}, '', '/login');  // redirect to /login
    setupLoginElements();
  } else if (html == "home.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/'); // redirect to / (no path)
    setupHomeElements();
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
