import { db, collection, getDocs } from './firebase.js';
import { renderHTML } from '../app.js'; // Import renderHTML for page redirection

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
          viewProfileButton.addEventListener('click', () => {
            // Redirect to the new profile page using renderHTML
            renderHTML('searchProfile.html');
            sessionStorage.setItem('viewedUserID', docSnapshot.id); // Store the user ID for use in searchProfile.js
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

// Export the handleSearchInput function
export { handleSearchInput };
