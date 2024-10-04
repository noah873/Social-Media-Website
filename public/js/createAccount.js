import { app, auth, createUserWithEmailAndPassword, db, doc, setDoc, collection, getDocs } from './firebase.js';
import { renderHTML } from '../app.js';

function setupCreateAccountElements() {
  const messageDiv = document.getElementById('message');
  const message2Div = document.getElementById('message2');

  const fullNameInput = document.getElementById('fullName');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const createAccountButton = document.getElementById('createAccountButton');
  const loginButton = document.getElementById('login');

  createAccountButton.addEventListener('click', async () => {
    const fullName = fullNameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate input fields
    if (!fullName || !username || !email || !password) {
      message2Div.textContent = 'All fields are required.';
      return;
    }

    try {
      // Check if username is already taken
      const currentUsers = await getDocs(collection(db, 'users'));
      const takenUsernames = currentUsers.docs.map(doc => doc.data().username);

      if (takenUsernames.includes(username)) {
        message2Div.textContent = 'Username already taken. Please try another.';
        return;
      }

      // Create the user account with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;  // Contains the UID for this user

      // Store user data in Firestore using UID as the document ID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,           // Unique identifier for this user
        email: email,
        full_name: fullName,
        username: username,
        online_status: 'online'
      });

      message2Div.textContent = 'Account successfully created. Redirecting to Home...';
      setTimeout(() => renderHTML("home.html"), 1500);  // Redirect to home page

    } catch (error) {
      console.error('Error creating account:', error);
      messageDiv.textContent = 'Error creating account: ' + error.message;
    }
  });

  // Event listeners for Enter key to trigger the button
  const triggerOnEnter = (element) => {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') createAccountButton.click();
    });
  };

  // Apply Enter key trigger for all input fields
  [fullNameInput, usernameInput, emailInput, passwordInput].forEach(triggerOnEnter);

  // Navigate to login page when "Log In" button is clicked
  loginButton.addEventListener('click', () => {
    renderHTML("login.html");
  });
}

export { setupCreateAccountElements };
