// post.js
function renderPosts(postData) {
  const postContainer = document.getElementById('postContainer'); 

  if (postContainer) {
    postData.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';

      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>Posted by: ${post.author}</small>
        <div class="post-footer">
          <div class="post-votes">
            <button class="upvote-button">Upvote</button>
            <small class="post-upvotes">${post.upvotes || 0}</small>
            <button class="downvote-button">Downvote</button>
            <small class="post-downvotes">${post.downvotes || 0}</small>
          </div>
        </div>
      `;

      postContainer.appendChild(postElement);

      // Add event listeners for upvote and downvote buttons
      const upvoteButton = postElement.querySelector('.upvote-button');
      const downvoteButton = postElement.querySelector('.downvote-button');
      const upvoteDisplay = postElement.querySelector('.post-upvotes');
      const downvoteDisplay = postElement.querySelector('.post-downvotes');

      upvoteButton.addEventListener('click', () => {
        post.upvotes = (post.upvotes || 0) + 1;
        upvoteDisplay.textContent = post.upvotes;
      });

      downvoteButton.addEventListener('click', () => {
        post.downvotes = (post.downvotes || 0) + 1;
        downvoteDisplay.textContent = post.downvotes;
      });
    });
  } else {
    console.warn("Post container not found in the DOM.");
  }
}

// Placeholder data for rendering
const samplePosts = [
  { title: 'Post 1', content: 'This is the content of post 1.', author: 'User A', upvotes: 0, downvotes: 0 },
  { title: 'Post 2', content: 'This is the content of post 2.', author: 'User B', upvotes: 0, downvotes: 0 }
];

// Load and render sample posts
/*document.addEventListener('DOMContentLoaded', () => {
  renderPosts(samplePosts);
});
*/
export { renderPosts };
