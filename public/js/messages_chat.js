import { db, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, getDoc } from './firebase.js'; // Firebase functions
import { renderHTML } from '../app.js'; // To redirect between pages
import { auth, onAuthStateChanged } from './firebase.js'; // Import auth to get the current user

// Function to set up the chat page
function setupSendMessagePage() {
  const recipientNameSpan = document.getElementById('recipientName');
  const chatLog = document.getElementById('chatLog');
  const messageContent = document.getElementById('messageContent');
  const sendMessageButton = document.getElementById('sendMessageButton');
  const backToMessages = document.getElementById('backToMessages');

  const recipientName = history.state?.recipient || 'Unknown';
  const recipientID = history.state?.recipientID || null;

  // Wait for authentication state change to ensure we have the current user ID
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const currentUserID = user.uid;

      // Fetch current user's username from Firestore
      const currentUserDocRef = doc(db, 'users', currentUserID);
      const currentUserDoc = await getDoc(currentUserDocRef);
      const currentUserName = currentUserDoc.exists() ? currentUserDoc.data().username : 'Unknown User';  // Use the Firestore username

      recipientNameSpan.textContent = recipientName;

      if (!recipientID || !currentUserID) {
        console.error("Recipient ID or current user ID is missing");
        return;
      }

      // Back button functionality
      if (backToMessages) {
        backToMessages.addEventListener('click', () => {
          renderHTML("messages.html");
        });
      }

      // Load existing chat messages between the current user and the recipient
      async function loadChatLog() {
        try {
          const chatQuery = query(
            collection(db, 'messages'),
            where('recipientID', 'in', [currentUserID, recipientID]),  // Chat between both users
            where('senderID', 'in', [currentUserID, recipientID]),     // Either is sender
            orderBy('timestamp', 'asc')  // Order by timestamp
          );
          const chatSnapshot = await getDocs(chatQuery);
          chatLog.innerHTML = ''; // Clear existing chat log

          chatSnapshot.docs.forEach(docSnapshot => {
            const messageData = docSnapshot.data();

            // Display the sender's name (use senderName from Firestore)
            const senderName = messageData.senderName || 'Unknown Sender';

            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            messageElement.innerHTML = `
              <div class="messageContent">
                <strong>${senderName}</strong>  <!-- Display sender's name -->
                <p>${messageData.content}</p>   <!-- Display message content -->
                <small>${new Date(messageData.timestamp.seconds * 1000).toLocaleString()}</small>  <!-- Display timestamp -->
              </div>
            `;

            chatLog.appendChild(messageElement);
          });

          console.log('Chat log loaded successfully');
        } catch (error) {
          console.error('Error loading chat log:', error);
        }
      }

      // Send message functionality
      if (sendMessageButton) {
        sendMessageButton.addEventListener('click', async () => {
          const messageText = messageContent.value.trim();
          if (messageText) {
            try {
              const senderName = currentUserName;  // Use the current user's Firestore username

              await addDoc(collection(db, 'messages'), {
                recipientID,
                senderID: currentUserID,  // Add the sender's ID (current user)
                senderName: senderName,   // Store the sender's name from Firestore
                content: messageText,
                timestamp: serverTimestamp(),  // Use Firestore server timestamp
                isRead: false           // Mark the message as unread by default
              });
              messageContent.value = '';  // Clear the message field
              loadChatLog();  // Reload the chat log to show the new message
            } catch (error) {
              console.error('Error sending message:', error);
            }
          } else {
            alert('Please type a message before sending.');
          }
        });
      }

      loadChatLog();  // Load the chat messages initially
    } else {
      console.error('No user is signed in');
    }
  });
}

export { setupSendMessagePage };
