import { fetchPosts, getUserData, updateVotes, addComment, fetchComments } from './firebase.js';

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

  await loadPostTemplate();

  if (!postTemplate) {
    console.warn('Post template is not available.');
    return;
  }

  fetchPosts(async posts => {
    postContainer.innerHTML = ''; 

    for (const postData of posts) {
      const postElement = postTemplate.cloneNode(true);

      const contentElement = postElement.querySelector('.post-content');
      if (contentElement) {
        contentElement.textContent = postData.content;
      }

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
        const upvoteButton = votesElement.querySelector('.upvote-button');
        const downvoteButton = votesElement.querySelector('.downvote-button');
        const upvoteDisplay = votesElement.querySelector('.post-upvotes');
        const downvoteDisplay = votesElement.querySelector('.post-downvotes');

        upvoteButton.addEventListener('click', async () => {
          postData.upvotes += 1;
          upvoteDisplay.textContent = postData.upvotes;
          await updateVotes(postData.id, postData.upvotes, postData.downvotes);
        });

        downvoteButton.addEventListener('click', async () => {
          postData.downvotes += 1;
          downvoteDisplay.textContent = postData.downvotes;
          await updateVotes(postData.id, postData.upvotes, postData.downvotes);
        });
      }

      // Comments Section
      const commentList = postElement.querySelector('.comments-list');
      const commentInput = postElement.querySelector('.comment-input');
      const commentSubmitButton = postElement.querySelector('.comment-submit-button');

      // Add comment submission functionality
      commentSubmitButton.addEventListener('click', async () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
          await addComment(postData.id, commentText);
          const newCommentElement = document.createElement('p');
          newCommentElement.textContent = commentText;
          commentList.appendChild(newCommentElement);
          commentInput.value = '';  // Clear input field after submission
        }
      });

      // Fetch and display existing comments
      const comments = await fetchComments(postData.id);
      comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = `${comment.timestamp} - ${comment.text}`;
        commentList.appendChild(commentElement);
      });

      postContainer.appendChild(postElement);
    }
  });
}

export { initializePostWall };
