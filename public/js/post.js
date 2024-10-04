// post.js
function renderPosts(postData) {
    const postContainer = document.getElementById('postContainer'); // Ensure you have a container for posts
  
    if (postContainer) {
      postData.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <small>Posted by: ${post.author}</small>
        `;
        postContainer.appendChild(postElement);
      });
    } else {
      console.warn("Post container not found in the DOM.");
    }
  }
  
  // Placeholder data for rendering
  const samplePosts = [
    { title: 'Post 1', content: 'This is the content of post 1.', author: 'User A' },
    { title: 'Post 2', content: 'This is the content of post 2.', author: 'User B' }
  ];
  
  // Load and render sample posts
  document.addEventListener('DOMContentLoaded', () => {
    renderPosts(samplePosts);
  });
  
  export { renderPosts };
  