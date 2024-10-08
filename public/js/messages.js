// Ensure the DOM is fully loaded before executing any JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const userContainer = document.getElementById('userContainer');
    const dmContainer = document.getElementById('dmContainer');
  
    if (!userContainer) {
      console.error('userContainer not found in the DOM');
      return;
    }
  
    if (!dmContainer) {
      console.error('dmContainer not found in the DOM');
      return;
    }
  
    // Function to render user suggestions
    /* async function loadSuggestedUsers() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
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
      */
  
    // Function to render direct messages
    async function loadDirectMessages() {
      try {
        const messagesSnapshot = await getDocs(collection(db, 'direct_messages'));
        messagesSnapshot.forEach((doc) => {
          const messageData = doc.data();
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
  
    // Load the users and direct messages
    loadSuggestedUsers();
    loadDirectMessages();
  });
  