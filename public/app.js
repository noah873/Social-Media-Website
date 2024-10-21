import { handleAuthStatus } from './js/authStatus.js';

import { setupLoginElements } from './js/login.js';
import { setupHomeElements } from './js/home.js';
import { setupCreateAccountElements } from './js/createAccount.js';
import { setupSettingsElements } from './js/settings.js';
import { setupResetPasswordElements } from './js/resetPassword.js';
import { setupCreatePostElements } from './js/createPost.js';
import { renderPosts } from './js/post.js';
import { loadDirectMessages } from './js/messages.js';
import { setupSendMessagePage } from './js/messages_chat.js';
import { setupNavbarElements } from './js/navbar.js';
import { setupProfileElements } from './js/profile.js';

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
    let pageHTML = await loadHTML("navbar.html");
    pageHTML += await loadHTML(html);
    app.innerHTML = pageHTML;
    history.pushState({}, '', '/'); // redirect URL to / (no path)
    setupHomeElements();
    setupNavbarElements("home");
    
  } else if (html == "createAccount.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/signup'); // redirect URL
    setupCreateAccountElements();
    
  } else if (html == "settings.html") {
    let pageHTML = await loadHTML("navbar.html");
    pageHTML += await loadHTML(html);
    app.innerHTML = pageHTML;
    history.pushState({}, '', '/settings'); // redirect URL
    setupSettingsElements();
    setupNavbarElements("settings");
    
  } else if (html === "createPost.html") {
    let pageHTML = await loadHTML("navbar.html");
    pageHTML += await loadHTML(html);
    app.innerHTML = pageHTML;
    history.pushState({}, '', '/create-post');
    setupCreatePostElements(); // Call the function from post.js
    setupNavbarElements("createPost");
    
  } else if (html == "resetPassword.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/reset-password'); // redirect URL
    setupResetPasswordElements();
    
  } else if (html === "messages.html") {
    let pageHTML = await loadHTML("navbar.html");
    pageHTML += await loadHTML(html);
    app.innerHTML = pageHTML;
    console.log("Loading global users...");
    history.pushState({}, '', '/messages'); // redirect URL
    setupNavbarElements("messages");
    loadDirectMessages()  // Now loading global users for messaging
      .then(() => console.log("Global users loaded successfully"))
      .catch((error) => console.error("Error loading global users:", error));
    
  } else if (html === "messages_chat.html") {
    app.innerHTML = await loadHTML(html);
    setupSendMessagePage();  // Setting up the chat page functionality
    history.pushState({}, '', '/messages-chat'); // redirect URL
    
  }
   else if (html === "profile.html") {
    let pageHTML = await loadHTML("navbar.html");
    pageHTML += await loadHTML(html);
    app.innerHTML = pageHTML;
    history.pushState({}, '', '/profile'); 
    setupProfileElements(); 
    setupNavbarElements("profile");
  }
}

export { renderHTML };
