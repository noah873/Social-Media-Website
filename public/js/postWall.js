import { fetchPosts, getUserData, updateVotes } from './firebase.js'; 

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

    // Loop through each post and render it
    for (const postData of posts) {
      // Clone the post template
      const postElement = postTemplate.cloneNode(true);

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

      // Set up the upvote and downvote buttons
      const votesElement = postElement.querySelector('.post-votes');
      if (votesElement) {
        votesElement.innerHTML = `
          <button class="upvote-button">Upvote</button>
          <small class="post-upvotes">${postData.upvotes || 0}</small>
          <button class="downvote-button">Downvote</button>
          <small class="post-downvotes">${postData.downvotes || 0}</small>
        `;

        // Add event listeners for upvote and downvote buttons
        const upvoteButton = votesElement.querySelector('.upvote-button');
        const downvoteButton = votesElement.querySelector('.downvote-button');
        const upvoteDisplay = votesElement.querySelector('.post-upvotes');
        const downvoteDisplay = votesElement.querySelector('.post-downvotes');

        // Handle upvote click
        upvoteButton.addEventListener('click', async () => {
          postData.upvotes += 1;
          upvoteDisplay.textContent = postData.upvotes;
          await updateVotes(postData.id, postData.upvotes, postData.downvotes);
        });

        // Handle downvote click
        downvoteButton.addEventListener('click', async () => {
          postData.downvotes += 1;
          downvoteDisplay.textContent = postData.downvotes;
          await updateVotes(postData.id, postData.upvotes, postData.downvotes);
        });
      }

      postContainer.appendChild(postElement);
    }
  });
}

export { initializePostWall };

