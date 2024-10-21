import { db, collection, getDocs, updateDoc, doc } from './firebase.js';  // Firebase functions
import { renderHTML } from '../app.js';  // Import renderHTML for redirection
import { auth, onAuthStateChanged } from './firebase.js';  // Import auth to get the current user

// Function to load and display all users (for adding friends)
async function loadFriends() {
    const backButton = document.getElementById('backButton');
    const userList = document.getElementById('userList');

    // Get the current logged-in user's ID
    const currentUser = auth.currentUser;
    const currentUserID = currentUser ? currentUser.uid : null;

    if (!currentUserID) {
        console.error("Current user ID is missing");
        return;
    }

    // Back button functionality
    if (backButton) {
        backButton.addEventListener('click', () => {
            renderHTML("home.html");  // Redirect to home page
        });
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

        // Iterate through each user and display them (excluding the current user)
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

            // Add event listener to "Add Friend" button
            const addFriendButton = userElement.querySelector('.addFriend');
            addFriendButton.addEventListener('click', () => {
                addFriend(currentUserID, userID);
            });

            userList.appendChild(userElement);
        });

        console.log('Global users loaded successfully');
    } catch (error) {
        console.error('Error fetching global users:', error);
    }
}

// Function to add a friend to both users' friend lists
async function addFriend(currentUserID, friendUserID) {
    try {
        const currentUserRef = doc(db, 'users', currentUserID);
        const friendUserRef = doc(db, 'users', friendUserID);

        // Get current user's data
        const currentUserSnapshot = await getDoc(currentUserRef);
        const currentUserData = currentUserSnapshot.data();

        // Get friend's data
        const friendUserSnapshot = await getDoc(friendUserRef);
        const friendUserData = friendUserSnapshot.data();

        // Update current user's friends list
        await updateDoc(currentUserRef, {
            friends: [...(currentUserData.friends || []), friendUserID]
        });

        // Update friend's friends list
        await updateDoc(friendUserRef, {
            friends: [...(friendUserData.friends || []), currentUserID]
        });

        console.log(`Successfully added ${friendUserID} as a friend to ${currentUserID}`);
    } catch (error) {
        console.error(`Error adding friend:`, error);
    }
}

// Event listener to load users when the DOM is ready
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadFriends();
    } else {
        console.error('No user is signed in');
        // Optionally redirect to login page
    }
});

// Export the loadFriends function
export { loadFriends };
