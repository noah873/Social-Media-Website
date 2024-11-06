import { db, collection, getDocs, query, where } from './firebase.js'; // Import necessary Firebase functions

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

      usersSnapshot.docs.forEach(docSnapshot => {
        const userData = docSnapshot.data();
        const username = userData.username.toLowerCase();
        const fullName = userData.full_name.toLowerCase();

        if (username.includes(searchTerm) || fullName.includes(searchTerm)) {
          // Create a result item
          const userElement = document.createElement('div');
          userElement.classList.add('user-search-result');

          userElement.innerHTML = `
            <div class="profile">
              <div class="name">
                <h3>${userData.username}</h3>
                <p><small>${userData.full_name}</small></p>
              </div>
            </div>
            <button class="btn viewProfile">View Profile</button>
          `;

          // Add event listener to "View Profile" button
          const viewProfileButton = userElement.querySelector('.viewProfile');
          viewProfileButton.addEventListener('click', () => {
            renderHTML("theirProfile.html", { recipientID: docSnapshot.id });
          });

          // Append the user element to the search results container
          searchResultsContainer.appendChild(userElement);
        }
      });
    } catch (error) {
      console.error('Error searching users:', error);
    }
  });
}

// Export the handleSearchInput function
export { handleSearchInput };
