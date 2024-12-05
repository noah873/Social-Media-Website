import { db, collection, getDocs, doc, getDoc, query, where } from './firebase.js';

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
    } else {
      console.error('User not found.');
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Function to load another user's posts
async function loadTheirPosts(userID) {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userID', '==', userID)); // Fetch only posts for the specific user
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
      postCount++; // Increment post count for each post
    });

    if (postBox.children.length === 0) {
      postBox.innerHTML = '<p class="empty-state">No posts to display.</p>';
    }

    // Update the post count in the profile stats
    const postCountElement = document.getElementById('postCount');
    if (postCountElement) {
      postCountElement.textContent = postCount;
    }
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

// Export the handleSearchInput function
export { handleSearchInput };
