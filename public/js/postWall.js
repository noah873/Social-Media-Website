import { fetchPosts, getUserData } from './firebase.js'; 

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
  await loadPostTemplate();

  if (!postTemplate) {
    console.warn('Post template is not available.');
    return;
  }

  // Fetch posts and render them in the post wall
  fetchPosts(async posts => {
    postContainer.innerHTML = ''; 

    for (const postData of posts) {
      const postElement = postTemplate.cloneNode(true);

      // Populate content
      const contentElement = postElement.querySelector('.post-content');
      if (contentElement) {
        contentElement.textContent = postData.content;
      }

      // Populate image
      const imageElement = postElement.querySelector('.post-image');
      if (imageElement && postData.imageURL) {
        imageElement.src = postData.imageURL; // Set image URL
        imageElement.alt = `Image for post by ${postData.userID}`; // Set alt text
      } else if (imageElement) {
        imageElement.style.display = 'none'; // Hide image if none is present
      }

      // Populate other fields like author and timestamp
      const userData = await getUserData(postData.userID);
      const authorElement = postElement.querySelector('.post-author');
      if (authorElement) {
        authorElement.textContent = `Posted by: ${userData.username || 'Unknown User'}`;
      }

      const timestampElement = postElement.querySelector('.post-timestamp');
      if (timestampElement) {
        timestampElement.textContent = postData.datetime;
      }

      postContainer.appendChild(postElement);
    }
  });
}

export { initializePostWall };
