import { db, collection, query, where, onSnapshot } from './firebase.js';
import { renderHTML } from '../app.js';
import { auth, onAuthStateChanged } from './firebase.js';

async function loadDirectMessages() {
  const backButton = document.getElementById('backButton');
  const userList = document.getElementById('userList');

  // Get the current logged-in user's ID
  const currentUser = auth.currentUser;
  const currentUserID = currentUser?.uid;

  if (!currentUserID) {
    console.error("Current user ID is missing");
    return;
  }

  // Back button functionality
  if (backButton) {
    backButton.addEventListener('click', () => {
      renderHTML("home.html"); // Redirect to home page
    });
  }

  if (!userList) {
    console.error('userList not found in the DOM.');
    return;
  }

  try {
    console.log('Loading global users...');
    userList.innerHTML = ''; // Clear previous users

    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef);

    onSnapshot(usersQuery, (snapshot) => {
      snapshot.docs.forEach((docSnapshot) => {
        const userData = docSnapshot.data();
        const userID = docSnapshot.id;

        if (userID === currentUserID) return; // Skip the current user

        // Create user element
        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.innerHTML = `
          <div class="profile">
            <div class="name">
              <h3>${userData.full_name}</h3>
              <p><small>${userData.email}</small></p>
              <span id="unread-${userID}"></span>
            </div>
          </div>
          <button class="btn sendMessage">Send Private Message</button>
        `;

        // Add event listener for sending a message
        const sendMessageButton = userElement.querySelector('.sendMessage');
        sendMessageButton.addEventListener('click', () => {
          const state = { recipient: userData.full_name, recipientID: userID };
          history.pushState(state, '', `messages_chat.html?recipientID=${userID}`);
          renderHTML("messages_chat.html");
        });

        userList.appendChild(userElement);

        // Add unread messages indicator
        checkForUnreadMessages(userID, currentUserID);
      });
    });
  } catch (error) {
    console.error('Error fetching global users:', error);
  }
}

function checkForUnreadMessages(userID, currentUserID) {
  const messagesRef = collection(db, 'messages');
  const unreadQuery = query(
    messagesRef,
    where('recipientID', '==', currentUserID),
    where('senderID', '==', userID),
    where('isRead', '==', false)
  );

  onSnapshot(unreadQuery, (snapshot) => {
    const unreadDot = document.getElementById(`unread-${userID}`);
    unreadDot.innerHTML = snapshot.size > 0 ? '<span class="unread-dot"></span>' : '';
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadDirectMessages();
  } else {
    console.error('No user is signed in');
    renderHTML("login.html"); // Redirect if not authenticated
  }
});

export { loadDirectMessages };
