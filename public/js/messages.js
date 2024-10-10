import { db, collection, getDocs, query, where } from './firebase.js'; // Firebase functions
import { renderHTML } from '../app.js'; // Import renderHTML for redirection
import { auth, onAuthStateChanged } from './firebase.js'; // Import auth to get the current user

async function loadDirectMessages() {
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

    // Iterate through each user and display them (including the current user for now)
    usersSnapshot.docs.forEach((docSnapshot) => {
      const userData = docSnapshot.data();
      const userID = docSnapshot.id;

      // Skip displaying the current logged-in user (optional)
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
            <span id="unread-${userID}"></span> <!-- Placeholder for unread message indicator -->
          </div>
        </div>
        <button class="btn sendMessage">Send Private Message</button>
      `;

      // Add event listener to "Send Private Message" button
      const sendMessageButton = userElement.querySelector('.sendMessage');
      sendMessageButton.addEventListener('click', () => {
        renderHTML("messages_chat.html", { recipient: userData.full_name, recipientID: userID });
      });

      userList.appendChild(userElement);

      // Check for unread messages for this user
      checkForUnreadMessages(userID, currentUserID);
    });

    console.log('Global users loaded successfully');
  } catch (error) {
    console.error('Error fetching global users:', error);
  }
}

// Function to check for unread messages and add the blue dot
async function checkForUnreadMessages(userID, currentUserID) {
  try {
    // Query to check unread messages from this user
    const unreadMessagesQuery = query(
      collection(db, 'messages'),
      where('recipientID', '==', currentUserID),
      where('senderID', '==', userID),
      where('isRead', '==', false)  // Only check for unread messages
    );

    const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);

    // If there are unread messages, display the blue dot
    if (!unreadMessagesSnapshot.empty) {
      const unreadDot = document.getElementById(`unread-${userID}`);
      unreadDot.innerHTML = '<span class="unread-dot"></span>';  // Add the blue dot
    }
  } catch (error) {
    console.error(`Error checking unread messages for user ${userID}:`, error);
  }
}

// Event listener to load direct messages when the DOM is ready
onAuthStateChanged(auth, (user) => {
  if (user) {
    const currentUserID = user.uid;
    loadDirectMessages(currentUserID);
  } else {
    console.error('No user is signed in');
    // Optionally redirect to login page
  }
});

// Export the loadDirectMessages function
export { loadDirectMessages };
