import { db, collection, getDocs } from './firebase.js'; // Import Firebase-related functions from firebase.js

// Function to render user suggestions
async function loadSuggestedUsers() {
  const userContainer = document.getElementById('userContainer');

  try {
    // Fetch user data from Firestore (assuming "users" collection exists)
    const usersSnapshot = await getDocs(collection(db, 'users'));

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();

      // Create user element
      const userElement = document.createElement('div');
      userElement.classList.add('user');

      userElement.innerHTML = `
        <div class="profile">
          <div class="name">
            <h3>${userData.full_name || 'Unknown'}</h3>
            <span>${userData.role || 'User'}</span>
          </div>
        </div>
        <button class="btn add">Add</button>
      `;

      userContainer.appendChild(userElement);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Function to render direct messages
async function loadDirectMessages() {
  const dmContainer = document.getElementById('dmContainer');

  try {
    // Fetch direct messages from Firestore (assuming "direct_messages" collection exists)
    const messagesSnapshot = await getDocs(collection(db, 'direct_messages'));

    messagesSnapshot.forEach((doc) => {
      const messageData = doc.data();

      // Create message element
      const dmElement = document.createElement('div');
      dmElement.classList.add('dm');

      dmElement.innerHTML = `
        <div class="profile">
          <div class="name">
            <h3>${messageData.sender || 'Unknown Sender'}</h3>
            <span>${messageData.message || 'No message content'}</span>
          </div>
        </div>
        <button class="btn reply">Reply</button>
      `;

      dmContainer.appendChild(dmElement);
    });
  } catch (error) {
    console.error('Error fetching direct messages:', error);
  }
}

// Call functions to load suggested users and direct messages
loadSuggestedUsers();
loadDirectMessages();

export { loadSuggestedUsers, loadDirectMessages };
