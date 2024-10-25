import { auth, db, collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from './firebase.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js';

// Initialize Firebase Storage
const storage = getStorage();

// Function to initialize the profile page
function setupProfileElements() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await loadUserProfile(user.uid);
        await loadUserPosts(user.uid);
    } else {
      console.error('No user is signed in.');
      return;
    }
  });

  // Add event listeners for the profile elements
  addEventListeners();
}

// Function to load user profile data
async function loadUserProfile(userID) {
  try {
    const userRef = doc(db, 'users', userID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById('profileName').textContent = userData.username || 'Unknown User';
      document.getElementById('profileBio').textContent = userData.bio || '';

      const profileImageElement = document.getElementById('profileImage');
      if (userData.profileImage) {
        profileImageElement.src = userData.profileImage;
      }

      await updateFriendsCount(userID);

      // Display the current profile data in the edit section
      displayCurrentProfileData(userData);
    } else {
      console.error('No user data found in Firestore.');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}


// Function to load and display the user's own posts
async function loadUserPosts(userID) {
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    const postBox = document.getElementById('postBox');
    postBox.innerHTML = ''; // Clear existing posts

    let postCount = 0; // Counter for the number of posts

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
        postCount++;
      }
    });

    // Update the post count in the profile stats
    document.getElementById('postCount').textContent = postCount;
  } catch (error) {
    console.error('Error loading user posts:', error);
  }
}

// Add event listeners to profile elements
function addEventListeners() {
  const editProfileButton = document.getElementById('editProfile');
  const saveProfileButton = document.getElementById('saveProfile');
  const backToProfileButton = document.getElementById('backToProfile'); // New back button
  const removeImageButton = document.getElementById('removeImage');
  const imageInput = document.getElementById('imageInput');
  const friendsButton = document.getElementById('friendsButton');
  const closeFriendsPopupButton = document.getElementById('closeFriendsPopup');

  backToProfileButton.addEventListener('click', () => {
    toggleEditProfile(false);
  });

  friendsButton.addEventListener('click', () => {
    document.getElementById('friendsPopup').style.display = 'flex';
    fetchAndDisplayFriends();
  });

  closeFriendsPopupButton.addEventListener('click', () => {
    document.getElementById('friendsPopup').style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    const popup = document.getElementById('friendsPopup');
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  });

  editProfileButton.addEventListener('click', () => {
    toggleEditProfile(true);
  });

  saveProfileButton.addEventListener('click', async () => {
    await saveProfileChanges();
  });

  // Add event listener for the back button
  backToProfileButton.addEventListener('click', () => {
    toggleEditProfile(false);
  });

  removeImageButton.addEventListener('click', async () => {
    await removeProfileImage();
  });

  // Remove the event listener for immediate image upload
imageInput.removeEventListener('change', handleProfileImageUpload);


  document.getElementById('closeTheirProfilePopup').addEventListener('click', () => {
    document.getElementById('theirProfilePopup').style.display = 'none';
  });
}

// Toggle edit profile visibility
function toggleEditProfile(show) {
  document.querySelector('.profile-header').style.display = show ? 'none' : 'flex';
  document.querySelector('.profile-stats').style.display = show ? 'none' : 'flex';
  document.querySelector('.post-box').style.display = show ? 'none' : 'block';
  document.getElementById('editProfileSection').style.display = show ? 'block' : 'none';
  document.getElementById('removeImage').style.display = show ? 'block' : 'none';
}


// Save profile changes
// Save profile changes only when "Save" is clicked
async function saveProfileChanges() {
  const newBio = document.getElementById('bioInput').value;
  const newProfileImage = document.getElementById('imageInput').files[0];

  // Create an object to hold the profile updates
  const updatedData = {};

  // If a new image is selected, upload it
  if (newProfileImage) {
    try {
      const imageUrl = await handleProfileImageUpload(newProfileImage);
      updatedData.profileImage = imageUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return; // Exit if image upload fails
    }
  }

  // If a new bio is entered, add it to the updates
  if (newBio) {
    updatedData.bio = newBio;
  }

  // Apply updates to Firestore and UI
  if (Object.keys(updatedData).length > 0) {
    await updateUserProfile(updatedData);

    // Update the profile UI with the new changes
    if (updatedData.profileImage) {
      document.getElementById('profileImage').src = updatedData.profileImage;
      document.getElementById('currentProfileImage').src = updatedData.profileImage;
    }
    if (updatedData.bio) {
      document.getElementById('profileBio').textContent = updatedData.bio;
      document.getElementById('currentBioText').textContent = updatedData.bio;
    }

    console.log('Profile updated successfully!');
  }

  // Close the edit profile section
  toggleEditProfile(false);
}

// Remove profile image
async function removeProfileImage() {
  document.getElementById('profileImage').src = 'default-profile.png';
  await updateUserProfile({ profileImage: '' });
}

// Function to fetch and display the current user's friends
async function fetchAndDisplayFriends() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('No user is signed in');
    return;
  }

  try {
    const friendsRef = collection(db, 'users', currentUser.uid, 'friends');
    const friendsSnapshot = await getDocs(friendsRef);
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';

    if (friendsSnapshot.empty) {
      const noFriendsItem = document.createElement('li');
      noFriendsItem.textContent = 'No friends found.';
      friendsList.appendChild(noFriendsItem);
    } else {
      for (const friendDoc of friendsSnapshot.docs) {
        const friendID = friendDoc.id;
        const friendUserRef = doc(db, 'users', friendID);
        const friendUserDoc = await getDoc(friendUserRef);

        if (friendUserDoc.exists()) {
          const friendUserData = friendUserDoc.data();
          const friendItem = document.createElement('li');
          const friendLink = document.createElement('a');
          friendLink.textContent = friendUserData.username || 'Unknown User';
          friendLink.href = '#';

          friendLink.addEventListener('click', (event) => {
            event.preventDefault();
            openTheirProfilePopup(friendID);
          });

          friendItem.appendChild(friendLink);
          friendsList.appendChild(friendItem);
        } else {
          console.error(`No data found for friend ID: ${friendID}`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
}

// Load the other user's profile into the popup
async function openTheirProfilePopup(friendID) {
  try {
    const userRef = doc(db, 'users', friendID);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById('theirProfileName').textContent = userData.username || 'Unknown User';
      document.getElementById('theirProfileBio').textContent = userData.bio || '';
      document.getElementById('theirProfileImage').src = userData.profileImage || 'default-profile.png';

      await loadTheirFriendsCount(friendID); 
      await loadTheirPosts(friendID);

      // Handle the "Remove Friend" button
      await setupRemoveFriendButton(friendID);

      document.getElementById('theirProfilePopup').style.display = 'flex';
    } else {
      console.error('User not found.');
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Set up the "Remove Friend" button within the popup
async function setupRemoveFriendButton(userID) {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid === userID) return;

  const removeFriendButton = document.getElementById('removeFriendButton');
  removeFriendButton.style.display = 'none'; // Hide by default

  try {
    const friendRef = doc(db, 'users', currentUser.uid, 'friends', userID);
    const friendDoc = await getDoc(friendRef);

    // If they are friends, show the "Remove Friend" button
    if (friendDoc.exists()) {
      removeFriendButton.style.display = 'inline-block';
      removeFriendButton.textContent = 'Remove Friend';
      removeFriendButton.classList.add('remove-friend');

      // Event listener for removing a friend
      removeFriendButton.addEventListener('click', async () => {
        await removeFriend(currentUser.uid, userID);
        removeFriendButton.textContent = 'Removed';
        removeFriendButton.disabled = true;
      });
    } else {
      console.log("Not friends with the user.");
    }
  } catch (error) {
    console.error('Error setting up Remove Friend button:', error);
  }
}

// Function to remove a friend from Firestore
async function removeFriend(currentUserID, targetUserID) {
  try {
    // Remove from current user's friends subcollection
    const currentUserFriendRef = doc(db, 'users', currentUserID, 'friends', targetUserID);
    await deleteDoc(currentUserFriendRef);

    // Remove from target user's friends subcollection
    const targetUserFriendRef = doc(db, 'users', targetUserID, 'friends', currentUserID);
    await deleteDoc(targetUserFriendRef);

    console.log(`Friend removed between ${currentUserID} and ${targetUserID}`);
  } catch (error) {
    console.error('Error removing friend:', error);
  }
}

// Function to load another user's posts
async function loadTheirPosts(userID) {
  try {
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    const theirPostsContainer = document.getElementById('theirPostsContainer');
    theirPostsContainer.innerHTML = '';

    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      if (post.userID === userID) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h3>${post.content}</h3>
          <small>${post.datetime.toDate().toLocaleString()}</small>
        `;
        theirPostsContainer.appendChild(postElement);
      }
    });
  } catch (error) {
    console.error('Error loading user posts:', error);
  }
}

// Function to load another user's friends count
async function loadTheirFriendsCount(userID) {
  try {
    const friendsRef = collection(db, 'users', userID, 'friends');
    const friendsSnapshot = await getDocs(friendsRef);
    document.getElementById('theirFriendsCount').textContent = friendsSnapshot.size;
  } catch (error) {
    console.error('Error loading friends count:', error);
  }
}

// Function to update the friends count
async function updateFriendsCount(userID) {
  try {
    const friendsRef = collection(db, 'users', userID, 'friends');
    const friendsSnapshot = await getDocs(friendsRef);
    document.getElementById('friendsCount').textContent = friendsSnapshot.size;
  } catch (error) {
    console.error('Error fetching friends count:', error);
  }
}

// Function to handle profile image upload to Firebase Storage
async function handleProfileImageUpload(file) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('No user is signed in');
    return;
  }

  try {
    const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl; // Return the uploaded image URL
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}


// Function to update user profile in Firestore
async function updateUserProfile(updatedData) {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, updatedData);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

// Function to display the current profile image and bio in the edit section
function displayCurrentProfileData(userData) {
  const currentImageElement = document.getElementById('currentProfileImage');
  const currentBioElement = document.getElementById('currentBioText');

  // Set the current profile image and bio
  currentImageElement.src = userData.profileImage || '/default_elements/default-profile.png';
  currentBioElement.textContent = userData.bio || 'No bio available';
}

// Ensure the DOM is fully loaded before initializing
document.addEventListener('DOMContentLoaded', setupProfileElements);

export { setupProfileElements };
