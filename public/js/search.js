import { db, collection, getDocs, doc, getDoc, query, where, setDoc, deleteDoc } from './firebase.js';
import { auth } from './firebase.js';

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

// Add functionality to the Back to Search button
document.addEventListener('DOMContentLoaded', () => {
  const backToSearchButton = document.getElementById('backToSearch');
  if (backToSearchButton) {
    backToSearchButton.addEventListener('click', () => {
      // Reload the page with the `?search=true` parameter
      window.location.href = `${window.location.origin}/?search=true`;
    });
  }

  // Check if the URL contains `?search=true`
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('search') === 'true') {
    document.getElementById('searchContainer').style.display = 'block';
    document.querySelector('.profile-container').style.display = 'none';
  }
});

// Export the handleSearchInput function
export { handleSearchInput };
