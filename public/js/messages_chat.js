import { db, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, getDoc, updateDoc } from './firebase.js';
import { renderHTML } from '../app.js';
import { auth, onAuthStateChanged } from './firebase.js';

async function setupSendMessagePage() {
  const recipientNameSpan = document.getElementById('recipientName');
  const chatLog = document.getElementById('chatLog');
  const messageContent = document.getElementById('messageContent');
  const sendMessageButton = document.getElementById('sendMessageButton');
  const backToMessages = document.getElementById('backToMessages');

  const params = new URLSearchParams(window.location.search);
  const recipientID = params.get('recipientID');
  const recipientName = params.get('recipientName') || 'Unknown';

  // Cache for fetched usernames to minimize Firestore queries
  const usernameCache = {};

  async function getUsername(userID) {
    if (usernameCache[userID]) {
      return usernameCache[userID];
    }
    try {
      const userRef = doc(db, 'users', userID);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const username = userDoc.data().username;
        usernameCache[userID] = username; // Cache the result
        return username;
      }
    } catch (error) {
      console.error(`Error fetching username for userID: ${userID}`, error);
    }
    //return 'Unknown'; // Fallback if username not found
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const currentUserID = user.uid;

      if (!recipientID) {
        alert('Recipient information is missing.');
        renderHTML('messages.html');
        return;
      }

      recipientNameSpan.textContent = recipientName;

      backToMessages.addEventListener('click', () => {
        renderHTML('messages.html');
      });

      const chatQuery = query(
        collection(db, 'messages'),
        where('recipientID', 'in', [currentUserID, recipientID]),
        where('senderID', 'in', [currentUserID, recipientID]),
        orderBy('timestamp', 'asc')
      );

      onSnapshot(chatQuery, async (snapshot) => {
        chatLog.innerHTML = '';
        for (const docSnapshot of snapshot.docs) {
          const messageData = docSnapshot.data();
          const senderName = await getUsername(messageData.senderID); // Get the username dynamically
          renderMessage({ ...messageData, senderName });
          markMessageAsRead(docSnapshot.id, messageData, currentUserID);
        }
      });

      sendMessageButton.addEventListener('click', async () => {
        const messageText = messageContent.value.trim();
        if (messageText) {
          await addDoc(collection(db, 'messages'), {
            recipientID,
            senderID: currentUserID,
            content: messageText,
            timestamp: serverTimestamp(),
            isRead: false,
          });
          messageContent.value = '';
        } else {
          alert('Please type a message before sending.');
        }
      });
    } else {
      console.error('No user is signed in');
    }
  });
}

function renderMessage({ senderName, content, timestamp }) {
  const chatLog = document.getElementById('chatLog');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <div class="messageContent">
      <strong>${senderName}</strong>
      <p>${content}</p>
      <small>${new Date(timestamp.seconds * 1000).toLocaleString()}</small>
    </div>
  `;
  chatLog.appendChild(messageElement);
}

function markMessageAsRead(docID, messageData, currentUserID) {
  if (messageData.recipientID === currentUserID && !messageData.isRead) {
    const messageRef = doc(db, 'messages', docID);
    updateDoc(messageRef, { isRead: true });
  }
}

export { setupSendMessagePage };
