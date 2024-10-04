// home.js
import { renderHTML } from '../app.js';
import { initializePostWall } from './postWall.js';

function setupHomeElements() {
  const settingsButton = document.getElementById('settings');
  const createPostButton = document.getElementById('createPostButton');

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

  // Initialize the post wall to display posts
  initializePostWall();
}

document.addEventListener('DOMContentLoaded', setupHomeElements);
export { setupHomeElements };
