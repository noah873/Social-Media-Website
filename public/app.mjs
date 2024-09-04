import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
  storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, "messages");

document.getElementById("submitButton").addEventListener("click", async () => {
    const inputBox = document.getElementById("inputBox");
    const text = inputBox.value;

    await addDoc(collectionRef, {
        text: text,
        timestamp: new Date()
    });
    inputBox.value = '';
});

const q = query(collectionRef, orderBy("timestamp", "desc"), limit(1));
onSnapshot(q, (snapshot) => {
    const display = document.getElementById("display");
    snapshot.forEach(doc => {
        display.innerText = doc.data().text;
    });
});

