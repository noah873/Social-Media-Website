import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
        import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBdddWqIoMKQlVc6ljxGHL7w4BRSrhHSHA",
            authDomain: "social-media-website-f8cd9.firebaseapp.com",
            projectId: "social-media-website-f8cd9",
            storageBucket: "social-media-website-f8cd9.appspot.com",
            messagingSenderId: "533945883416",
            appId: "1:533945883416:web:5561d99d84a3943e9d5c6d",
            measurementId: "G-MR502NE9B0"
        };


        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Reference to the Firestore collection
        const collectionRef = collection(db, "messages");

        // Function to submit data
        window.addEventListener("DOMContentLoaded", () => {
            document.getElementById("submitButton").addEventListener("click", async () => {
                const inputBox = document.getElementById("inputBox");
                const text = inputBox.value;

                if (text) {
                    // Add a new document with a generated ID
                    await addDoc(collectionRef, {
                        message: text,
                        timestamp: new Date()
                    });

                    // Clear the input box
                    inputBox.value = "";
                }
            });

            // Function to update display with the most recent document
            function updateDisplay(doc) {
                const display = document.getElementById("display");
                display.innerText = doc.exists() ? doc.data().message : "No data available";
            }

            // Listen to real-time updates from Firestore
            const q = query(collectionRef, orderBy("timestamp", "desc"), limit(1));
            onSnapshot(q, (snapshot) => {
                snapshot.forEach(doc => {
                    updateDisplay(doc);
                });
                if (snapshot.empty) {
                    updateDisplay({});
                }
            });
        });
