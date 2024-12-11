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

  if (!recipientID) {
    alert('Recipient information is missing.');
    renderHTML('messages.html');
    return;
  }

  let currentUserID = null;
  const usernameCache = {}; // Cache for usernames

  async function getUsername(userID) {
    if (usernameCache[userID]) {
      return usernameCache[userID];
    }
    try {
      const userRef = doc(db, 'users', userID);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const username = userDoc.data().username || 'Unknown';
        usernameCache[userID] = username;
        return username;
      }
    } catch (error) {
      console.error(`Error fetching username for userID: ${userID}`, error);
    }
    return 'Unknown';
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.error('No user is signed in');
      renderHTML('login.html');
      return;
    }

    currentUserID = user.uid;

    let recipientName = params.get('recipientName');
    if (!recipientName) {
      try {
        const recipientUser = await getDoc(doc(db, 'users', recipientID));
        if (recipientUser.exists()) {
          recipientName = recipientUser.data().username || 'Unknown';
        } else {
          recipientName = 'Unknown';
        }
      } catch (error) {
        console.error(`Error fetching recipient name: ${error}`);
        recipientName = 'Unknown';
      }
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
        const senderName = await getUsername(messageData.senderID);
        renderMessage({ ...messageData, senderName });
        markMessageAsRead(docSnapshot.id, messageData, currentUserID);
      }
    });

    sendMessageButton.addEventListener('click', async () => {
      const messageText = messageContent.value.trim();
      if (messageText) {
        try {
          await addDoc(collection(db, 'messages'), {
            recipientID,
            senderID: currentUserID,
            content: messageText,
            timestamp: serverTimestamp(),
            isRead: false,
          });
          messageContent.value = '';
        } catch (error) {
          console.error('Error sending message:', error);
        }
      } else {
        alert('Please type a message before sending.');
      }
    });
  });
}

function renderMessage({ senderName, content, timestamp }) {
  const chatLog = document.getElementById('chatLog');
  const messageElement = document.createElement('div');

  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <div class="messageContent">
      <strong>${senderName}</strong> <!-- Display sender name -->
      <p>${content}</p>
      <small>${new Date(timestamp.seconds * 1000).toLocaleString()}</small>
    </div>
  `;

  chatLog.appendChild(messageElement);
  chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the latest message
}

function markMessageAsRead(docID, messageData, currentUserID) {
  if (messageData.recipientID === currentUserID && !messageData.isRead) {
    const messageRef = doc(db, 'messages', docID);
    updateDoc(messageRef, { isRead: true });
  }
}

export { setupSendMessagePage };
