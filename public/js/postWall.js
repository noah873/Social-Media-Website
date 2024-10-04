// postWall.js
import { fetchPosts } from './firebase.js';

function initializePostWall() {
  const postContainer = document.getElementById('postsContainer');

  if (!postContainer) {
    console.warn("postContainer not found in the DOM.");
    return;
  }

  fetchPosts(posts => {
    postContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
        <p>${post.content}</p>
        <small>${post.datetime}</small>
        <small>Upvotes: ${post.upvotes} | Downvotes: ${post.downvotes}</small>
      `;
      postContainer.appendChild(postElement);
    });
  });
}

export { initializePostWall };
