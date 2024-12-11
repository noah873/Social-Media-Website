import { fetchPosts, getUserData } from './firebase.js';
import { renderPosts } from './post.js';

let postTemplate = null;

// Load the post template from post.html
async function loadPostTemplate() {
  try {
    const response = await fetch('/html/post.html');
    if (!response.ok) {
      throw new Error(`Failed to load post.html: ${response.statusText}`);
    }
    const templateHTML = await response.text();
    const templateContainer = document.createElement('div');
    templateContainer.innerHTML = templateHTML.trim();
    postTemplate = templateContainer.querySelector('.post');
  } catch (error) {
    console.error('Error loading post template:', error);
  }
}

async function initializePostWall() {
  const postContainer = document.getElementById('postsContainer');

  if (!postContainer) {
    console.warn('postContainer not found in the DOM.');
    return;
  }

  // Load the post template
  if (!postTemplate) {
    await loadPostTemplate();
  }

  // Fetch posts and pass them to renderPosts
  fetchPosts(async (posts) => {
    posts = await Promise.all(posts.map(async (post) => {
      const userData = await getUserData(post.userID);
      return { ...post, username: userData.username || 'Unknown User' };
    }));

    renderPosts(posts, postContainer, postTemplate);
  });
}

export { initializePostWall };
