import { auth, onAuthStateChanged, db, doc, getDoc, updateDoc } from './firebase.js'
import { renderHTML } from '../app.js';

// updates online_status field
function updateUserStatus(user, status) {
  const userRef = doc(db, 'users', user.uid);
  return updateDoc(userRef, {
      online_status: status
  }).catch(error => {
    console.error(error);
  });
}

// update user status when they switch tabs or minimize window
function handleVisibilityChange() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    if (document.hidden) {
      updateUserStatus(currentUser, "idle");
    } else {
      updateUserStatus(currentUser, "online");
    }
  }
}

// set user to offline if they close the tab (while still logged in)
function handleBeforeUnload() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    updateUserStatus(currentUser, "offline");
  }
}

let lastUser = null; // keep track of the last user to update their status when they log out

function handleAuthStatus() {
  // triggered when a user signs in or out
  onAuthStateChanged(auth, user => {
    const deletingAccount = sessionStorage.getItem('deletingAccount');
  
    if (deletingAccount) { // if key exists in session storage (confined to the tab)
      // removes item from session storage to allow the user to refresh page and redirect to login page
      sessionStorage.removeItem('deletingAccount');
      return;
    }
    
    if (user) { // visitor is logged in
      lastUser = user;
      
      renderHTML("home.html");
  
      // set user as online after they login, create and account, or visit a page while logged in
      updateUserStatus(user, "online");
  
      // update user status when they switch tabs or minimize window
      document.addEventListener('visibilitychange', handleVisibilityChange);
  
      // set user to offline if they close the tab (while still logged in)
      window.addEventListener('beforeunload', handleBeforeUnload);

      // check if user's email in firestore is up to date with firestore authentication, updating if needed
      const firebaseEmail = user.email;
      const userRef = doc(db, 'users', user.uid);
      return getDoc(userRef)
        .then((doc) => {
          const firestoreEmail = doc.data().email;
          if (firestoreEmail !== firebaseEmail) {
            return updateDoc(userRef, {
              email: firebaseEmail
            })
              .catch(error => {
                console.error(error);
              });
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else { // visitor is not logged in
      renderHTML("login.html");
      
      // set last user to offline if they signed out
      if (lastUser) {
        updateUserStatus(lastUser, "offline");
      }

      // remove event listeners after logout to prevent updateUserStatus calls
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });
}

export { handleAuthStatus };
