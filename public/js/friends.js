import { renderHTML } from '../app.js'; // Import renderHTML for redirection
import { auth, db, collection, doc, getDocs, addDoc, onAuthStateChanged, query, where, getDoc, setDoc } from './firebase.js'; // Include setDoc here


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
        userList.innerHTML = ''; // Clear the container to avoid duplicates

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

            // Add event listener for the button
            const friendButton = userElement.querySelector('.btn');
            friendButton.addEventListener('click', async () => {
                if (isFriend) {
                    // Remove friend
                    await removeFriend(currentUserID, userID);
                    friendButton.textContent = 'Add Friend';
                    friendButton.classList.remove('friends');
                    friendButton.classList.add('addFriend');
                } else {
                    // Add friend
                    await addFriend(currentUserID, userID);
                    friendButton.textContent = 'Remove Friend';
                    friendButton.classList.remove('addFriend');
                    friendButton.classList.add('friends');
                }
            });

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
    try {
        // Check the 'friends' subcollection of the current user
        const friendRef = doc(db, 'users', currentUserID, 'friends', selectedUserID);
        const friendDoc = await getDoc(friendRef);

        return friendDoc.exists(); // Return true if friend exists in subcollection
    } catch (error) {
        console.error('Error checking friends:', error);
        return false;
    }
}

// Function to add a friend to the user's 'friends' subcollection
async function addFriend(currentUserID, selectedUserID) {
    try {
        // Add friend to the current user's 'friends' subcollection
        const currentUserFriendRef = doc(db, 'users', currentUserID, 'friends', selectedUserID);
        await setDoc(currentUserFriendRef, { addedAt: new Date() });

        // Add the current user to the selected user's 'friends' subcollection
        const selectedUserFriendRef = doc(db, 'users', selectedUserID, 'friends', currentUserID);
        await setDoc(selectedUserFriendRef, { addedAt: new Date() });

        // Increment the numFriends field for both users
        await incrementFriendCount(currentUserID);
        await incrementFriendCount(selectedUserID);

        console.log(`Friend added between ${currentUserID} and ${selectedUserID}`);
        alert('Friend added successfully!');
    } catch (error) {
        console.error('Error adding friend:', error);
        alert('Failed to add friend.');
    }
}

// Function to remove a friend
async function removeFriend(currentUserID, selectedUserID) {
    try {
        // Remove friend from the current user's 'friends' subcollection
        const currentUserFriendRef = doc(db, 'users', currentUserID, 'friends', selectedUserID);
        await deleteDoc(currentUserFriendRef);

        // Remove the current user from the selected user's 'friends' subcollection
        const selectedUserFriendRef = doc(db, 'users', selectedUserID, 'friends', currentUserID);
        await deleteDoc(selectedUserFriendRef);

        console.log(`Friend removed between ${currentUserID} and ${selectedUserID}`);
        alert('Friend removed successfully!');
    } catch (error) {
        console.error('Error removing friend:', error);
        alert('Failed to remove friend.');
    }
}

// Function to increment the numFriends field
async function incrementFriendCount(userID) {
    try {
        const userRef = doc(db, 'users', userID);
        await setDoc(userRef, { numFriends: 1 }, { merge: true });
    } catch (error) {
        console.error('Error updating friend count:', error);
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
