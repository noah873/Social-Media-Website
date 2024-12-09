import { db, doc, getDoc, collection, getDocs, query, where, setDoc, deleteDoc } from './firebase.js';
import { auth } from './firebase.js';
import { renderHTML } from '../app.js'; // Import renderHTML for navigation

// Function to load and display the user's profile
async function loadUserProfile() {
  const userID = sessionStorage.getItem('viewedUserID'); // Retrieve the user ID from sessionStorage

  if (!userID) {
    console.error('No user ID found.');
    return;
  }

  try {
    const userRef = doc(db, 'users', userID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Populate the profile elements
      document.getElementById('profileName').textContent = userData.username || 'Unknown User';
      document.getElementById('profileBio').textContent = userData.bio || '';
      const profileImageElement = document.getElementById('profileImage');
      profileImageElement.src = userData.profileImage || '/default_elements/default-profile.png';

      await loadUserPosts(userID);
      await updateUserFriendsCount(userID);
      setupFriendButton(userID);
    } else {
      console.error('User not found.');
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Add functionality for the Back to Search button
function setupBackButton() {
    const backToSearchButton = document.getElementById('backToSearch');
    if (!backToSearchButton) return;
  
    backToSearchButton.addEventListener('click', () => {
      // Redirect back to the search page
      sessionStorage.removeItem('viewedUserID'); // Clean up session data
      renderHTML('search.html'); // Use renderHTML for SPA navigation
    });
  }

// Function to load the user's posts
async function loadUserPosts(userID) {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, where('userID', '==', userID));
  const postsSnapshot = await getDocs(q);
  const postBox = document.getElementById('postBox');
  postBox.innerHTML = ''; // Clear existing posts

  postsSnapshot.forEach((doc) => {
    const post = doc.data();
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <h3>${post.content}</h3>
      <small>${post.datetime.toDate().toLocaleString()}</small>
    `;
    postBox.appendChild(postElement);
  });

  if (postBox.children.length === 0) {
    postBox.innerHTML = '<p class="empty-state">No posts to display.</p>';
  }
}

// Function to update the user's friends count
async function updateUserFriendsCount(userID) {
  const friendsRef = collection(db, 'users', userID, 'friends');
  const friendsSnapshot = await getDocs(friendsRef);
  document.getElementById('friendsCount').textContent = friendsSnapshot.size;
}

// Function to set up the Add/Remove Friend button
async function setupFriendButton(userID) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('No user is signed in.');
    return;
  }

  const friendButton = document.getElementById('friendButton');
  if (!friendButton) {
    console.error('Friend button is missing.');
    return;
  }

  const friendRef = doc(db, 'users', currentUser.uid, 'friends', userID);
  const friendDoc = await getDoc(friendRef);

  if (friendDoc.exists()) {
    friendButton.textContent = 'Remove Friend';
    friendButton.onclick = async () => {
      await removeFriend(currentUser.uid, userID);
      setupFriendButton(userID);
    };
  } else {
    friendButton.textContent = 'Add Friend';
    friendButton.onclick = async () => {
      await addFriend(currentUser.uid, userID);
      setupFriendButton(userID);
    };
  }
}

// Function to add a friend
async function addFriend(currentUserID, targetUserID) {
  const friendRef = doc(db, 'users', currentUserID, 'friends', targetUserID);
  const reverseFriendRef = doc(db, 'users', targetUserID, 'friends', currentUserID);

  await setDoc(friendRef, { addedAt: new Date() });
  await setDoc(reverseFriendRef, { addedAt: new Date() });
}

// Function to remove a friend
async function removeFriend(currentUserID, targetUserID) {
  const friendRef = doc(db, 'users', currentUserID, 'friends', targetUserID);
  const reverseFriendRef = doc(db, 'users', targetUserID, 'friends', currentUserID);

  await deleteDoc(friendRef);
  await deleteDoc(reverseFriendRef);
}

// Initialize the profile page
document.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();
  setupBackButton(); // Initialize the back button
});

// Export loadUserProfile for use in app.js
export { loadUserProfile };
