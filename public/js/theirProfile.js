import { auth, db, getDoc, doc, collection, getDocs, deleteDoc } from './firebase.js';
import { renderHTML } from '../app.js'; // Import renderHTML for redirection

// Get user ID from URL query parameter
function getUserIDFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userID');
}

// Load the profile data of another user
async function loadTheirProfile(userID) {
  try {
    const userRef = doc(db, 'users', userID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Update profile elements
      document.getElementById('theirProfileName').textContent = userData.username || 'Unknown User';
      document.getElementById('theirProfileBio').textContent = userData.bio || '';
      document.getElementById('theirProfileImage').src = userData.profileImage || 'default-profile.jpg';

      // Load user's posts and friends count
      await loadTheirPosts(userID);
      await loadTheirFriendsCount(userID);

      // Set up "Remove Friend" button
      await setupRemoveFriendButton(userID);
    } else {
      console.error('User not found.');
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Load user's posts
async function loadTheirPosts(userID) {
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    const postContainer = document.getElementById('theirPostsContainer');
    postContainer.innerHTML = '';

    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      if (post.userID === userID) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h3>${post.content}</h3>
          <small>${post.datetime.toDate().toLocaleString()}</small>
        `;
        postContainer.appendChild(postElement);
      }
    });
  } catch (error) {
    console.error('Error loading user posts:', error);
  }
}

// Load user's friends count
async function loadTheirFriendsCount(userID) {
  try {
    const friendsRef = collection(db, 'users', userID, 'friends');
    const friendsSnapshot = await getDocs(friendsRef);
    const friendsCountElement = document.getElementById('theirFriendsCount');
    friendsCountElement.textContent = friendsSnapshot.size;
  } catch (error) {
    console.error('Error loading friends count:', error);
  }
}

// Set up the "Remove Friend" button
async function setupRemoveFriendButton(userID) {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid === userID) return;

  const removeFriendButton = document.getElementById('removeFriendButton');

  try {
    const friendRef = doc(db, 'users', currentUser.uid, 'friends', userID);
    const friendDoc = await getDoc(friendRef);

    // Show the "Remove Friend" button if they are friends
    if (friendDoc.exists()) {
      removeFriendButton.style.display = 'inline-block';
      removeFriendButton.textContent = 'Remove Friend';
      removeFriendButton.classList.add('remove-friend');

      // Event listener for removing friend
      removeFriendButton.addEventListener('click', async () => {
        await removeFriend(currentUser.uid, userID);
        removeFriendButton.textContent = 'Removed';
        removeFriendButton.disabled = true;
      });
    } else {
      removeFriendButton.style.display = 'none'; // Hide if not friends
    }
  } catch (error) {
    console.error('Error setting up Remove Friend button:', error);
  }
}

// Function to remove a friend from Firestore
async function removeFriend(currentUserID, targetUserID) {
  try {
    // Remove from current user's friends subcollection
    const currentUserFriendRef = doc(db, 'users', currentUserID, 'friends', targetUserID);
    await deleteDoc(currentUserFriendRef);

    // Remove from target user's friends subcollection
    const targetUserFriendRef = doc(db, 'users', targetUserID, 'friends', currentUserID);
    await deleteDoc(targetUserFriendRef);

    console.log(`Friend removed between ${currentUserID} and ${targetUserID}`);
  } catch (error) {
    console.error('Error removing friend:', error);
  }
}

// Initialize the profile page for another user
document.addEventListener('DOMContentLoaded', async () => {
  const userID = getUserIDFromURL();
  if (userID) {
    await loadTheirProfile(userID);
  } else {
    console.error('No user ID found in URL.');
  }

  // Add event listener to the back button
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => {
      const lastPage = sessionStorage.getItem('lastPage');
      if (document.referrer) {
        window.history.back();
      } else if (lastPage) {
        window.location.href = lastPage;
      } else {
        window.location.href = '/html/profile.html'; // Adjust the path
      }
    });
  }
});
