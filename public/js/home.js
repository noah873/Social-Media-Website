// home.js
import { renderHTML } from '../app.js';
import { initializePostWall } from './postWall.js';

function setupHomeElements() {
  /*
  const settingsButton = document.getElementById('settings');
  const createPostButton = document.getElementById('createPostButton');
  const messagesButton = document.getElementById('messagesButton');

  // Check if settingsButton exists and set up its event listener
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      renderHTML("settings.html");
    });
  } else {
    console.warn("settingsButton not found in the DOM.");
  }

  // Check if createPostButton exists and set up its event listener
  if (createPostButton) {
    createPostButton.addEventListener('click', () => {
      renderHTML("createPost.html");
    });

  } else {
    console.warn("createPostButton not found in the DOM.");
  }

  if (messagesButton) {
    messagesButton.addEventListener('click', () => {
      renderHTML("messages.html");
    });
    
  } else {
    console.warn("messagesButton not found in the DOM.");
  }

  if (profileButton) {
        profileButton.addEventListener('click', () => {
            renderHTML('profile.html'); // Load the profile page
        });
  } else {
        console.warn("profileButton not found in the DOM.");
  }
  */

  // Initialize the post wall to display posts
  initializePostWall();
}

document.addEventListener('DOMContentLoaded', setupHomeElements);
export { setupHomeElements };
