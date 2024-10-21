import { renderHTML } from '../app.js'; // Import renderHTML for redirection
import { auth, collection, db, getDocs, onAuthStateChanged } from './firebase.js'; // Firebase functions
// Function to load global users

if (backButton) {
    backButton.addEventListener('click', () => {
      renderHTML("home.html");  // Redirect to home page
    });
}
async function loadGlobalUsers() {
    const userList = document.getElementById('userList');

    // Get the current logged-in user's ID
    const currentUser = auth.currentUser;
    const currentUserID = currentUser ? currentUser.uid : null;

    if (!currentUserID) {
        console.error("Current user ID is missing");
        return;
    }

    if (!userList) {
        console.error('userList not found in the DOM.');
        return;
    }

    try {
        console.log('Loading global users...');

        // Fetch all global users from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));
        userList.innerHTML = '';  // Clear the container to avoid duplicates

        // Iterate through each user and display them
        usersSnapshot.docs.forEach((docSnapshot) => {
            const userData = docSnapshot.data();
            const userID = docSnapshot.id;

            // Skip displaying the current logged-in user
            if (userID === currentUserID) {
                return;
            }

            // Create user element
            const userElement = document.createElement('div');
            userElement.classList.add('user');

            userElement.innerHTML = `
        <div class="profile">
          <div class="name">
            <h3>${userData.full_name}</h3>
            <p><small>${userData.email}</small></p>
          </div>
        </div>
        <button class="btn addFriend">Add Friend</button>
      `;

            // Append the user element to the user list
            userList.appendChild(userElement);
        });

        console.log('Global users loaded successfully');
    } catch (error) {
        console.error('Error fetching global users:', error);
    }
}

// Event listener to load global users when the DOM is ready
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadGlobalUsers();
    } else {
        console.error('No user is signed in');
        // Optionally redirect to login page
    }
});

// Export the loadGlobalUsers function
export { loadGlobalUsers };
