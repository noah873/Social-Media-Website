import { renderHTML } from '../app.js'; // Import renderHTML for redirection
import { auth, collection, db, getDocs, addDoc, onAuthStateChanged, query, where, getDocs as getDocsQuery } from './firebase.js'; // Firebase functions

// Function to load global users
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
        for (const docSnapshot of usersSnapshot.docs) {
            const userData = docSnapshot.data();
            const userID = docSnapshot.id;

            // Skip displaying the current logged-in user
            if (userID === currentUserID) {
                continue;
            }

            // Check if the current user is already friends with the displayed user
            const isFriend = await checkIfFriends(currentUserID, userID);

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
                <button class="btn ${isFriend ? 'friends' : 'addFriend'}">
                    ${isFriend ? 'Friends' : 'Add Friend'}
                </button>
            `;

            // Add event listener to "Add Friend" button if they're not friends yet
            if (!isFriend) {
                const addFriendButton = userElement.querySelector('.addFriend');
                addFriendButton.addEventListener('click', async () => {
                    await addFriend(currentUserID, userID);
                    addFriendButton.textContent = 'Friends'; // Change button text to "Friends"
                    addFriendButton.classList.remove('addFriend'); // Remove addFriend class
                    addFriendButton.classList.add('friends'); // Add friends class
                    addFriendButton.disabled = true; // Disable the button after adding
                });
            }

            // Append the user element to the user list
            userList.appendChild(userElement);
        }

        console.log('Global users loaded successfully');
    } catch (error) {
        console.error('Error fetching global users:', error);
    }
}

// Function to check if two users are already friends
async function checkIfFriends(currentUserID, selectedUserID) {
    const friendsQuery = query(
        collection(db, 'friends'),
        where('userID1', 'in', [currentUserID, selectedUserID]),
        where('userID2', 'in', [currentUserID, selectedUserID])
    );
    const friendsSnapshot = await getDocsQuery(friendsQuery);

    return !friendsSnapshot.empty; // Returns true if they are already friends
}

// Function to add a friend to Firestore
async function addFriend(currentUserID, selectedUserID) {
    try {
        // Create a new document in the 'friends' collection
        await addDoc(collection(db, 'friends'), {
            userID1: currentUserID,
            userID2: selectedUserID
        });

        console.log(`Friend added: ${currentUserID} and ${selectedUserID}`);
        alert('Friend added successfully!');
    } catch (error) {
        console.error('Error adding friend:', error);
        alert('Failed to add friend.');
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
