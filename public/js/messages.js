import { db, collection, getDocs, doc, getDoc } from './firebase.js'; // Import Firebase functions

// Function to render direct messages
async function loadDirectMessages() {
  const dmContainer = document.getElementById('dmContainer');

  if (!dmContainer) {
    console.error('dmContainer not found in the DOM.');
    return;
  }

  try {
    // Fetch direct messages from Firestore (assuming "messages" collection exists)
    const messagesSnapshot = await getDocs(collection(db, 'messages'));

    // Clear the dmContainer to avoid duplicates
    dmContainer.innerHTML = '';

    // Iterate over each message document
    for (const docSnapshot of messagesSnapshot.docs) {
      const messageData = docSnapshot.data();

      // Fetch the sender's information using the sender_id from the users collection
      const senderDocRef = doc(db, 'users', messageData.sender_id);
      const senderDocSnapshot = await getDoc(senderDocRef);
      const senderData = senderDocSnapshot.exists() ? senderDocSnapshot.data() : { full_name: 'Unknown Sender' };

      // Create message element
      const dmElement = document.createElement('div');
      dmElement.classList.add('dm');

      // Format the timestamp into a human-readable format
      const messageTimestamp = messageData.timestamp ? new Date(messageData.timestamp.seconds * 1000).toLocaleString() : 'Unknown time';

      // Render message content with sender name and message timestamp
      dmElement.innerHTML = `
        <div class="profile">
          <div class="name">
            <h3>${senderData.full_name || 'Unknown Sender'}</h3>
            <span>${messageData.content || 'No message content'}</span>
            <p><small>${messageTimestamp}</small></p>
          </div>
        </div>
        <button class="btn reply">Reply</button>
      `;

      // Append message element to the container
      dmContainer.appendChild(dmElement);
    }
  } catch (error) {
    console.error('Error fetching direct messages:', error);
  }
}

// Call the function to load direct messages
document.addEventListener('DOMContentLoaded', loadDirectMessages);

export { loadDirectMessages };
