import { addPostToFirestore } from './firebase.js';
import { renderHTML } from '../app.js'; // Import renderHTML for page navigation

function setupCreatePostElements() {
  const backButton = document.getElementById('backButton');
  const submitPostButton = document.getElementById('submitPostButton');
  const postContentTextarea = document.getElementById('postContent');

  // Back button functionality
  if (backButton) {
    backButton.addEventListener('click', () => {
      renderHTML("home.html");
    });
  }

  // Submit post functionality
  if (submitPostButton) {
    submitPostButton.addEventListener('click', async () => {
      const postContent = postContentTextarea.value.trim();
      if (postContent) {
        try {
          await addPostToFirestore(postContent);
          postContentTextarea.value = ''; // Clear the textarea after posting
          alert('Post submitted successfully');
          renderHTML("home.html"); // Redirect to home screen after posting
        } catch (error) {
          console.error("Error submitting post:", error);
          alert('Failed to submit post. Please try again.');
        }
      } else {
        alert("Post content cannot be empty");
      }
    });
  }
}

export { setupCreatePostElements };
