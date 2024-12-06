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
import { handleSearchInput } from './js/search.js';

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

/* SOLID Principles: This code block adheres to the Single Responsibility Principle,
with distinct functions like renderHTML, loadHTML, loadNavbar, as well as setup functions
for each page, each having clear responsibilities.
   It also follows the Open for Extension/Closed for Modification Principle, as new HTML pages
can be added to the to Single Page Application here without needing to modify existing functions.
The conditional blocks in renderHTML would just need to be extended to support of the needs of any new pages.
*/
async function renderHTML(html) {
  const navbarPlaceholder = document.getElementById('navbarPlaceholder');  
  const app = document.getElementById('app');
  
  // Check if elements exist
  if (!navbarPlaceholder || !app) {
    console.error("Navbar or app element is missing from the DOM.");
    return;
  }
  
  async function loadNavbar(activePage) {
    navbarPlaceholder.innerHTML = await loadHTML("navbar.html");
    setupNavbarElements(activePage);
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
    await loadNavbar("home");
    history.pushState({}, '', '/'); // redirect URL to / (no path)
    setupHomeElements();
    
  } else if (html === "messages.html") {
    await loadNavbar("messages");
    console.log("Loading global users...");
    history.pushState({}, '', '/messages'); // redirect URL
    loadDirectMessages()  // Now loading global users for messaging
      .then(() => console.log("Global users loaded successfully"))
      .catch((error) => console.error("Error loading global users:", error));
    
  } else if (html === "friends.html") {
    await loadNavbar("friends");
    history.pushState({}, '', '/friends'); // redirect URL to friends
    loadGlobalUsers();

  } else if (html === "search.html") {
    await loadNavbar("search");
    history.pushState({}, '', '/search'); // redirect URL to friends
    handleSearchInput();    

  } else if (html === "createPost.html") {
    await loadNavbar("createPost");
    history.pushState({}, '', '/create-post');
    setupCreatePostElements(); // Call the function from post.js
    
  } else if (html === "profile.html") {
    await loadNavbar("profile");
    history.pushState({ page: 'profile' }, '', '/profile');
    setupProfileElements();

  } else if (html === "theirProfile.html") {
    history.pushState({ page: 'theirProfile' }, '', window.location.href);
    // Additional logic for theirProfile can be added here
    
  } else if (html === "settings.html") {
    await loadNavbar("settings");
    history.pushState({}, '', '/settings'); // redirect URL
    setupSettingsElements();
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
