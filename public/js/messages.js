import { db, collection, getDocs, doc, getDoc } from './firebase.js'; // Import Firebase-related functions

async function loadDirectMessages() {
  const dmContainer = document.getElementById('dmContainer');
  console.log(dmContainer);  // Log to check if it exists

  if (!dmContainer) {
    console.error('dmContainer not found in the DOM.');
    return;
  }

  try {
    // Fetch direct messages from Firestore
    console.log('Loading direct messages...');
    const messagesSnapshot = await getDocs(collection(db, 'messages'));

    // Clear the container to avoid duplicates
    dmContainer.innerHTML = '';

    // Loop through messages
    for (const docSnapshot of messagesSnapshot.docs) {
      const messageData = docSnapshot.data();

      // Check if sender_id exists
      if (!messageData.sender_id) {
        console.error('Missing sender_id in message:', messageData);
        continue;  // Skip if no sender_id is available
      }

      // Fetch the sender's details using sender_id
      const senderDocRef = doc(db, 'users', messageData.sender_id);
      const senderDocSnapshot = await getDoc(senderDocRef);
      const senderData = senderDocSnapshot.exists() ? senderDocSnapshot.data() : { full_name: 'Unknown Sender' };

      // Create message element
      const dmElement = document.createElement('div');
      dmElement.classList.add('dm');

      // Format the timestamp if available
      const messageTimestamp = messageData.timestamp ? new Date(messageData.timestamp.seconds * 1000).toLocaleString() : 'Unknown time';

      // Render message content
      dmElement.innerHTML = `
        <div class="profile">
          <div class="name">
            <h3>${senderData.full_name}</h3>
            <span>${messageData.content || 'No message content'}</span>
            <p><small>${messageTimestamp}</small></p>
          </div>
        </div>
        <button class="btn reply">Reply</button>
      `;

      // Append message to container
      dmContainer.appendChild(dmElement);
    }

    console.log('Direct messages loaded successfully');
  } catch (error) {
    console.error('Error fetching direct messages:', error);
  }
}

export { loadDirectMessages };
