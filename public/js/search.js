import { db, collection, getDocs } from './firebase.js';
import { renderHTML } from '../app.js';

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
      // Fetch all users from Firestore and filter by search term
      const usersSnapshot = await getDocs(collection(db, 'users'));

      usersSnapshot.docs.forEach((docSnapshot) => {
        const userData = docSnapshot.data();
        const username = userData.username.toLowerCase();
        const fullName = userData.full_name.toLowerCase();

        if (username.includes(searchTerm) || fullName.includes(searchTerm)) {
          // Create a result item
          const userElement = document.createElement('div');
          userElement.classList.add('user-search-result');

          userElement.innerHTML = `
            <span class="username">${userData.username}</span>
            <span class="full-name">${userData.full_name}</span>
            <button class="btn viewProfile">View Profile</button>
          `;

          // Add event listener to "View Profile" button
          const viewProfileButton = userElement.querySelector('.viewProfile');
          viewProfileButton.addEventListener('click', () => {
            // Use renderHTML to load theirProfile.html dynamically
            renderHTML("theirProfile.html").then(() => {
              // Save current page as the last page
              sessionStorage.setItem("lastPage", window.location.href);

              // Update the browser's URL
              const userIDParam = new URLSearchParams();
              userIDParam.append("userID", docSnapshot.id);
              history.pushState({}, '', `/html/theirProfile.html?${userIDParam.toString()}`);

              // Dynamically load theirProfile.js and call loadTheirProfile
              import('./theirProfile.js')
                .then((module) => {
                  module.loadTheirProfile(docSnapshot.id);
                })
                .catch((error) => {
                  console.error('Error loading theirProfile.js:', error);
                });
            });
          });

          // Append the user element to the search results container
          searchResultsContainer.appendChild(userElement);
        }
      });

      // Handle no results found
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
