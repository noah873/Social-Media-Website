import { fetchPosts, getUserData } from './firebase.js'; // Import getUserData for fetching user details

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
    postContainer.innerHTML = ''; // Clear existing posts

    // Loop through each post and render it
    for (const postData of posts) {
      // Clone the post template
      const postElement = postTemplate.cloneNode(true);

      // Ensure that postElement is an HTML element
      if (!(postElement instanceof HTMLElement)) {
        console.error('Failed to clone post element as HTMLElement');
        return;
      }

      // Fill in the post content
      const contentElement = postElement.querySelector('.post-content');
      if (contentElement) {
        contentElement.textContent = postData.content;
      }

      // Fetch the username from the users collection
      const userData = await getUserData(postData.userID);
      const authorElement = postElement.querySelector('.post-author');
      if (authorElement) {
        authorElement.textContent = `Posted by: ${userData.username || 'Unknown User'}`;
      }

      const timestampElement = postElement.querySelector('.post-timestamp');
      if (timestampElement) {
        timestampElement.textContent = postData.datetime;
      }

      const votesElement = postElement.querySelector('.post-votes');
      if (votesElement) {
        votesElement.textContent = `Upvotes: ${postData.upvotes} | Downvotes: ${postData.downvotes}`;
      }

      // Append the post element to the post container
      postContainer.appendChild(postElement);
    }
  });
}

export { initializePostWall };
