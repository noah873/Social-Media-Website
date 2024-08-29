import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

const firebaseConfig = {
        apiKey: "AIzaSyBdddWqIoMKQlVc6ljxGHL7w4BRSrhHSHA",
        authDomain: "social-media-website-f8cd9.firebaseapp.com",
        projectId: "social-media-website-f8cd9",
        storageBucket: "social-media-website-f8cd9.appspot.com",
        messagingSenderId: "533945883416",
        appId: "1:533945883416:web:5561d99d84a3943e9d5c6d",
        measurementId: "G-MR502NE9B0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, "inputs");

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
        display.innerText = doc.data().message;
    });
});
