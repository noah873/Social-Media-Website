import { db, collection, getDocs, doc, getDoc, query, where, setDoc, deleteDoc } from './firebase.js';
import { auth } from './firebase.js'; // Ensure the Firebase auth object is imported

// Function to handle the search input functionality
function handleSearchInput() {
  const userSearchInput = document.getElementById('userSearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');

  if (!userSearchInput || !searchResultsContainer) {
    console.error('Search input or results container is missing from the DOM.');
    return;
  }

  userSearchInput.addEventListener('input', async (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (!searchTerm) return; // Do nothing if search term is empty

    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));

      usersSnapshot.docs.forEach((docSnapshot) => {
        const userData = docSnapshot.data();
        const username = userData.username.toLowerCase();
        const fullName = userData.full_name.toLowerCase();

        if (username.includes(searchTerm) || fullName.includes(searchTerm)) {
          const userElement = document.createElement('div');
          userElement.classList.add('user-search-result');

          userElement.innerHTML = `
            <span class="username">${userData.username}</span>
            <span class="full-name">${userData.full_name}</span>
            <button class="btn viewProfile">View Profile</button>
          `;

          const viewProfileButton = userElement.querySelector('.viewProfile');
          viewProfileButton.addEventListener('click', async () => {
            await loadAndDisplayTheirProfile(docSnapshot.id);
          });

          searchResultsContainer.appendChild(userElement);
        }
      });

      if (searchResultsContainer.children.length === 0) {
        searchResultsContainer.innerHTML = '<p>No users found.</p>';
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  });
}

// Function to load and display another user's profile
async function loadAndDisplayTheirProfile(userID) {
  try {
    const userRef = doc(db, 'users', userID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Populate profile elements dynamically
      document.getElementById('profileName').textContent = userData.username || 'Unknown User';
      document.getElementById('profileBio').textContent = userData.bio || '';
      const profileImageElement = document.getElementById('profileImage');
      profileImageElement.src = userData.profileImage || '/default_elements/default-profile.png';

      await loadTheirPosts(userID);
      await updateTheirFriendsCount(userID);

      // Toggle visibility between search and profile views
      document.getElementById('searchContainer').style.display = 'none';
      document.querySelector('.profile-container').style.display = 'block';

      // Set up friend button functionality
      setupFriendButton(userID);
    } else {
      console.error('User not found.');
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
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

  try {
    // Check if the selected user is already a friend
    const friendRef = doc(db, 'users', currentUser.uid, 'friends', userID);
    const friendDoc = await getDoc(friendRef);

    if (friendDoc.exists()) {
      // User is already a friend - set up "Remove Friend" functionality
      friendButton.textContent = 'Remove Friend';
      friendButton.onclick = async () => {
        await removeFriend(currentUser.uid, userID);
        setupFriendButton(userID); // Update button state after removing friend
      };
    } else {
      // User is not a friend - set up "Add Friend" functionality
      friendButton.textContent = 'Add Friend';
      friendButton.onclick = async () => {
        await addFriend(currentUser.uid, userID);
        setupFriendButton(userID); // Update button state after adding friend
      };
    }
  } catch (error) {
    console.error('Error setting up friend button:', error);
  }
}

// Function to add a friend
async function addFriend(currentUserID, targetUserID) {
  try {
    const friendRef = doc(db, 'users', currentUserID, 'friends', targetUserID);
    await setDoc(friendRef, { addedAt: new Date() });

    const reverseFriendRef = doc(db, 'users', targetUserID, 'friends', currentUserID);
    await setDoc(reverseFriendRef, { addedAt: new Date() });

    console.log(`Friend added between ${currentUserID} and ${targetUserID}`);
  } catch (error) {
    console.error('Error adding friend:', error);
  }
}

// Function to remove a friend
async function removeFriend(currentUserID, targetUserID) {
  try {
    const friendRef = doc(db, 'users', currentUserID, 'friends', targetUserID);
    await deleteDoc(friendRef);

    const reverseFriendRef = doc(db, 'users', targetUserID, 'friends', currentUserID);
    await deleteDoc(reverseFriendRef);

    console.log(`Friend removed between ${currentUserID} and ${targetUserID}`);
  } catch (error) {
    console.error('Error removing friend:', error);
  }
}

// Function to load another user's posts
async function loadTheirPosts(userID) {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userID', '==', userID));
    const postsSnapshot = await getDocs(q);
    const postBox = document.getElementById('postBox');
    postBox.innerHTML = ''; // Clear existing posts

    let postCount = 0; // Initialize post count

    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <h3>${post.content}</h3>
        <small>${post.datetime.toDate().toLocaleString()}</small>
      `;
      postBox.appendChild(postElement);
      postCount++;
    });

    if (postBox.children.length === 0) {
      postBox.innerHTML = '<p class="empty-state">No posts to display.</p>';
    }

    document.getElementById('postCount').textContent = postCount;
  } catch (error) {
    console.error('Error loading user posts:', error);
  }
}

// Function to update another user's friends count
async function updateTheirFriendsCount(userID) {
  try {
    const friendsRef = collection(db, 'users', userID, 'friends');
    const friendsSnapshot = await getDocs(friendsRef);
    document.getElementById('friendsCount').textContent = friendsSnapshot.size;
  } catch (error) {
    console.error('Error updating friends count:', error);
  }
}

// Add functionality to the Back to Search button
document.addEventListener('DOMContentLoaded', () => {
  const backToSearchButton = document.getElementById('backToSearch');
  if (backToSearchButton) {
    backToSearchButton.addEventListener('click', () => {
      // Hide the profile view
      document.querySelector('.profile-container').style.display = 'none';

      // Show the search view
      document.getElementById('searchContainer').style.display = 'block';
    });
  }
});

// Export the handleSearchInput function
export { handleSearchInput };
