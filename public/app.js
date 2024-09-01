import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCaCCK38R9btLtT5SLCwRB97vv9qbj8RFM",
  authDomain: "social-media-website-db1fe.firebaseapp.com",
  projectId: "social-media-website-db1fe",
  storageBucket: "social-media-website-db1fe.appspot.com",
  messagingSenderId: "989794613612",
  appId: "1:989794613612:web:b757ace6b828d44087db49"
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

