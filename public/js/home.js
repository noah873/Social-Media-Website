function setupHomeElements() {
  const signOutButton = document.getElementById('signOut');
  
  signOutButton.addEventListener('click', () => {
    signOut(auth)
  });
}

export {setupHomeElements};
