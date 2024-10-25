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
import { loadGlobalUsers } from './js/friends.js';

// redirects viewer to login page if not logged in and home page if they are
// handles online, idle, and offline statuses
// ensures firestore stores the user's correct email in the event of an email revert
handleAuthStatus();

async function loadHTML(html) {
  // Ensure correct path
  const response = await fetch(`/html/${html}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${html}: ${response.statusText}`);
  }
  return await response.text();
}


async function renderHTML(html) {
  const navbarPlaceholder = document.getElementById('navbarPlaceholder');  
  const app = document.getElementById('app');
  
  // Check if elements exist
  if (!navbarPlaceholder || !app) {
    console.error("Navbar or app element is missing from the DOM.");
    return;
  }
  
  async function ensureNavbarLoaded() {
    if (navbarPlaceholder.innerHTML === '') {
        navbarPlaceholder.innerHTML = await loadHTML("navbar.html");
    }
  }

    // Set Page
    try {
      app.innerHTML = await loadHTML(html);
    } catch (error) {
      console.error(`Error loading HTML for ${html}:`, error);
      return;
    }

  // Navigation Bar Pages
  if (html === "home.html") {
    await ensureNavbarLoaded();
    history.pushState({}, '', '/'); // redirect URL to / (no path)
    setupHomeElements();
    setupNavbarElements("home");
    
  } else if (html === "messages.html") {
    await ensureNavbarLoaded();
    console.log("Loading global users...");
    history.pushState({}, '', '/messages'); // redirect URL
    setupNavbarElements("messages");
    loadDirectMessages()  // Now loading global users for messaging
      .then(() => console.log("Global users loaded successfully"))
      .catch((error) => console.error("Error loading global users:", error));
    
  } else if (html === "friends.html") {
    await ensureNavbarLoaded();
    history.pushState({}, '', '/friends'); // redirect URL to friends
    loadGlobalUsers();
    setupNavbarElements("friends");  // Update the active navbar
    
  } else if (html === "createPost.html") {
    await ensureNavbarLoaded();
    history.pushState({}, '', '/create-post');
    setupCreatePostElements(); // Call the function from post.js
    setupNavbarElements("createPost");
    
  } else if (html === "profile.html") {
    await ensureNavbarLoaded();
    history.pushState({ page: 'profile' }, '', '/profile');
    setupProfileElements();
    setupNavbarElements("profile");

  } else if (html === "theirProfile.html") {
    history.pushState({ page: 'theirProfile' }, '', window.location.href);
    // Additional logic for theirProfile can be added here
    
  } else if (html === "settings.html") {
    await ensureNavbarLoaded();
    history.pushState({}, '', '/settings'); // redirect URL
    setupSettingsElements();
    setupNavbarElements("settings");
  }

  // All Other Pages (not in navbar)
  if (html === "login.html") {
    navbarPlaceholder.innerHTML = '';
    history.pushState({}, '', '/login');  // redirect URL
    setupLoginElements();
    
  } else if (html === "createAccount.html") {
    navbarPlaceholder.innerHTML = '';
    history.pushState({}, '', '/signup'); // redirect URL
    setupCreateAccountElements();
    
  }  else if (html === "resetPassword.html") {
    navbarPlaceholder.innerHTML = '';
    history.pushState({}, '', '/reset-password'); // redirect URL
    setupResetPasswordElements();
    
  } else if (html === "messages_chat.html") {
    navbarPlaceholder.innerHTML = '';
    setupSendMessagePage();  // Setting up the chat page functionality
    history.pushState({}, '', '/messages-chat'); // redirect URL
  } 
}

// Handle the browser's back/forward button navigation
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page) {
    renderHTML(`${event.state.page}.html`);
  }
});

export { renderHTML };
