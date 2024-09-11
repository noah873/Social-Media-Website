import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCaCCK38R9btLtT5SLCwRB97vv9qbj8RFM",
  authDomain: "social-media-website-db1fe.firebaseapp.com",
  projectId: "social-media-website-db1fe",
  storageBucket: "social-media-website-db1fe.appspot.com",
  messagingSenderId: "989794613612",
  appId: "1:989794613612:web:b757ace6b828d44087db49"
};

initializeApp(firebaseConfig);
const auth = getAuth();

async function loadHTML(html) {
  const response = await fetch(`html/${html}`);
  return await response.text();
}

async function renderHTML(html) {
  const app = document.getElementById('app');
  
  if (html == "login.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/login');  // redirect to /login
    setupElements();
  } else if (html == "home.html") {
    app.innerHTML = await loadHTML(html);
    history.pushState({}, '', '/'); // redirect to / (no path)
    setupElements();
  }
}

function setupElements() {
  const messageDiv = document.getElementById('message');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const signInButton = document.getElementById('signIn');
  const createAccountButton = document.getElementById('createAccount');
  
  const signOutButton = document.getElementById('signOut');

  signInButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      messageDiv.textContent = 'Invalid Email or Password';
    }
  });

  createAccountButton.addEventListener('click', () => {
      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        messageDiv.textContent = 'Error Creating Account';
      }
  });

  signOutButton.addEventListener('click', () => {
    try {
      signOut(auth);
      emailInput.value = '';
      passwordInput.value = '';
      messageDiv.textContent = 'Log into Nexus';
    } catch (error) {
      console.error('Error Signing Out:', error);
    }
  });
}

onAuthStateChanged(auth, user => {
  if (user) {
    renderHTML("home.html");
  } else {
    renderHTML("login.html");
  }
});
