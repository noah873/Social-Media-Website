import { db, collection, getDocs, doc, getDoc } from './firebase.js';

function handleSearchInput() {
  const userSearchInput = document.getElementById('userSearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');

  if (!userSearchInput || !searchResultsContainer) {
    console.error('Search input or results container is missing from the DOM.');
    return;
  }

  userSearchInput.addEventListener('input', async (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (!searchTerm) return;

    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));

      usersSnapshot.docs.forEach((docSnapshot) => {
        const userData = docSnapshot.data();
        const username = userData.username.toLowerCase();
        const fullName = userData.full_name.toLowerCase();

        if (username.includes(searchTerm) || fullName.includes(searchTerm)) {
          const userElement = document.createElement('div');
          userElement.classList.add('user-search-result');

          userElement.innerHTML = `
            <span class="username">${userData.username}</span>
            <span class="full-name">${userData.full_name}</span>
            <button class="btn viewProfile">View Profile</button>
          `;

          const viewProfileButton = userElement.querySelector('.viewProfile');
          viewProfileButton.addEventListener('click', async () => {
            console.log(`View Profile button clicked for userID: ${docSnapshot.id}`);
            await loadAndDisplayTheirProfile(docSnapshot.id);
          });

          searchResultsContainer.appendChild(userElement);
        }
      });

      if (searchResultsContainer.children.length === 0) {
        searchResultsContainer.innerHTML = '<p>No users found.</p>';
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  });
}

async function loadAndDisplayTheirProfile(userID) {
  console.log(`Loading profile for userID: ${userID}`);
  try {
    const userRef = doc(db, 'users', userID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById('profileName').textContent = userData.username || 'Unknown User';
      document.getElementById('profileBio').textContent = userData.bio || '';
      const profileImageElement = document.getElementById('profileImage');
      profileImageElement.src = userData.profileImage || '/default_elements/default-profile.png';

      await loadTheirPosts(userID);
      await updateTheirFriendsCount(userID);

      document.getElementById('searchContainer').style.display = 'none';
      document.querySelector('.profile-container').style.display = 'block';
    } else {
      console.error('User not found in Firestore.');
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

async function loadTheirPosts(userID) {
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    const postBox = document.getElementById('postBox');
    postBox.innerHTML = '';

    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      if (post.userID === userID) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h3>${post.content}</h3>
          <small>${post.datetime.toDate().toLocaleString()}</small>
        `;
        postBox.appendChild(postElement);
      }
    });
  } catch (error) {
    console.error('Error loading user posts:', error);
  }
}

async function updateTheirFriendsCount(userID) {
  try {
    const friendsRef = collection(db, 'users', userID, 'friends');
    const friendsSnapshot = await getDocs(friendsRef);
    document.getElementById('friendsCount').textContent = friendsSnapshot.size;
  } catch (error) {
    console.error('Error updating friends count:', error);
  }
}

export { handleSearchInput };
