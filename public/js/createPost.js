import { addPostToFirestore } from './firebase.js';
import { renderHTML } from '../app.js'; // Import renderHTML for page navigation

function setupCreatePostElements() {
  const backButton = document.getElementById('backButton');
  const submitPostButton = document.getElementById('submitPostButton');
  const postContentTextarea = document.getElementById('postContent');
  const postImageInput = document.getElementById('postImage');
  const imagePreview = document.getElementById('imagePreview');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');

  // Back button functionality
  if (backButton) {
    backButton.addEventListener('click', () => {
      renderHTML("home.html");
    });
  }

  // Image preview functionality
  if (postImageInput) {
    postImageInput.addEventListener('change', () => {
      const file = postImageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imagePreview.src = event.target.result; // Set preview image source
          imagePreviewContainer.style.display = 'block'; // Show preview container
        };
        reader.readAsDataURL(file); // Read the file as a DataURL
      } else {
        imagePreview.src = ''; // Clear the image preview
        imagePreviewContainer.style.display = 'none'; // Hide preview container
      }
    });
  }

  // Submit post functionality
  if (submitPostButton) {
    submitPostButton.addEventListener('click', async () => {
      const postContent = postContentTextarea.value.trim();
      const postImage = postImageInput.files[0];

      if (!postContent && !postImage) {
        alert("Please enter some text or upload an image before posting.");
        return;
      }

      try {
        // Pass both content and image to Firestore
        await addPostToFirestore(postContent, postImage);
        postContentTextarea.value = ''; // Clear textarea
        postImageInput.value = ''; // Clear file input
        imagePreview.src = ''; // Clear image preview
        imagePreviewContainer.style.display = 'none'; // Hide preview container
        alert('Post submitted successfully');
        renderHTML("home.html"); // Redirect to home screen
      } catch (error) {
        console.error("Error submitting post:", error);
        alert('Failed to submit post. Please try again.');
      }
    });
  }
}

export { setupCreatePostElements };
