import { db, collection, getDocs } from './firebase.js';
import { renderHTML } from '../app.js';

const searchInput = document.getElementById('userSearchInput');
const resultsContainer = document.getElementById('searchResultsContainer');

// Listen for changes in the search input field
searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        resultsContainer.innerHTML = '';
        return;
    }

    try {
        // Fetch all users from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));
        resultsContainer.innerHTML = ''; // Clear existing results

        usersSnapshot.docs.forEach(docSnapshot => {
            const userData = docSnapshot.data();
            if (userData.username.toLowerCase().includes(searchTerm)) {
                const userElement = document.createElement('div');
                userElement.classList.add('user');

                userElement.innerHTML = `
                    <div class="profile">
                        <div class="name">
                            <h3>${userData.username}</h3>
                            <p><small>${userData.full_name}</small></p>
                        </div>
                    </div>
                    <button class="btn viewProfile">View Profile</button>
                `;

                const viewProfileButton = userElement.querySelector('.viewProfile');
                viewProfileButton.addEventListener('click', () => {
                    renderHTML('theirProfile.html', { recipient: userData.username, recipientID: docSnapshot.id });
                });
                
                resultsContainer.appendChild(userElement);
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});
