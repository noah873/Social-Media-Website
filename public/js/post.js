import { updatePostVotes } from './firebase.js';
import { auth } from './firebase.js';

function renderPosts(postData, container, template) {
  container.innerHTML = ''; // Clear existing posts

  postData.forEach((post) => {
    const postElement = template.cloneNode(true);

    // Populate fields
    const contentElement = postElement.querySelector('.post-content');
    if (contentElement) contentElement.textContent = post.content;

    const imageElement = postElement.querySelector('.post-image');
    if (imageElement && post.imageURL) {
      imageElement.src = post.imageURL;
      imageElement.alt = `Image for post by ${post.userID}`;
    } else if (imageElement) {
      imageElement.style.display = 'none';
    }

    const authorElement = postElement.querySelector('.post-author');
    if (authorElement) authorElement.textContent = `${post.username}`;

    const timestampElement = postElement.querySelector('.post-timestamp');
    if (timestampElement) timestampElement.textContent = post.datetime;

    // Populate profile image
    const profileImageElement = postElement.querySelector('.author-profile-image');
    if (profileImageElement) {
      profileImageElement.src = post.profileImage;
      profileImageElement.alt = `Profile image of ${post.username}`;
    }

    // Upvotes/Downvotes
    const upvoteButton = postElement.querySelector('.upvote-button');
    const downvoteButton = postElement.querySelector('.downvote-button');
    const upvoteDisplay = postElement.querySelector('.post-upvotes');
    const downvoteDisplay = postElement.querySelector('.post-downvotes');

    upvoteDisplay.textContent = post.upvotes || 0;
    downvoteDisplay.textContent = post.downvotes || 0;

    // Voting logic
    const handleVote = async (voteType) => {
      const userID = auth.currentUser?.uid;
      if (!userID) {
        console.warn('User not logged in.');
        return;
      }

      await updatePostVotes(post.id, userID, voteType);

      // Update UI immediately
      const updatedPost = (await getDoc(doc(db, 'posts', post.id))).data();
      upvoteDisplay.textContent = updatedPost.upvotes || 0;
      downvoteDisplay.textContent = updatedPost.downvotes || 0;
    };

    upvoteButton.addEventListener('click', () => handleVote('upvote'));
    downvoteButton.addEventListener('click', () => handleVote('downvote'));

    container.appendChild(postElement);
  });
}


export { renderPosts };
