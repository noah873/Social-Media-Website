import { auth, onAuthStateChanged, db, doc, updateDoc } from './firebase.js'
import { renderHTML } from '../app.js';

// updates online_status field
function updateUserStatus(user, isOnline) {
  const userRef = doc(db, 'users', user.uid);
  return updateDoc(userRef, {
      online_status: isOnline
  }).catch(error => {
    console.error(error);
  });
}

function handleVisibilityChange() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    if (document.hidden) {
      updateUserStatus(currentUser, false);
    } else {
      updateUserStatus(currentUser, true);
    }
  }
}

function handleBeforeUnload() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    updateUserStatus(currentUser, false);
  }
}

function handleAuthStatus() {
  // triggered when a user signs in or out
  onAuthStateChanged(auth, user => {
    const deletingAccount = sessionStorage.getItem('deletingAccount');
  
    if (deletingAccount === 'true') {
      return;
    }
    
    if (user) {
      renderHTML("home.html");
  
      // set user as online after they login, create and account, or visit a page while logged in
      updateUserStatus(user, true);
  
      // update user status when they switch tabs or minimize window
      document.addEventListener('visibilitychange', handleVisibilityChange);
  
      // set user to not online if they close the tab (while still logged in)
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      // set user to not online if they sign out
      auth.onAuthStateChanged((currentUser) => {
        if (!currentUser) {
          updateUserStatus(user, false);
          // remove event listeners after logout
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('beforeunload', handleBeforeUnload);
        }
      });
    } else {
      renderHTML("login.html");
    }
  });
}

export { handleAuthStatus };
