document.getElementById('editProfile').addEventListener('click', function() {
  document.querySelector('.profile-header').style.display = 'none';
  document.querySelector('.profile-stats').style.display = 'none';
  document.querySelector('.post-box').style.display = 'none';
  document.getElementById('editProfileSection').style.display = 'block';
  
  document.getElementById('removeImage').style.display = 'block';
});

document.getElementById('saveProfile').addEventListener('click', function() {
  const newBio = document.getElementById('bioInput').value;
  const newProfileImage = document.getElementById('imageInput').files[0];

  if (newProfileImage) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profileImage').src = e.target.result;
    };
    reader.readAsDataURL(newProfileImage);
  }

  document.getElementById('profileBio').textContent = newBio;

  document.querySelector('.profile-header').style.display = 'flex';
  document.querySelector('.profile-stats').style.display = 'flex';
  document.querySelector('.post-box').style.display = 'block';
  document.getElementById('editProfileSection').style.display = 'none';

  document.getElementById('removeImage').style.display = 'none';
});

document.getElementById('removeImage').addEventListener('click', function() {
  document.getElementById('profileImage').src = 'default-profile.jpg';  
});

let posts = [];

document.getElementById('createPost').addEventListener('click', function() {
  document.getElementById('postSection').style.display = 'block';
  document.querySelector('.profile-header').style.display = 'none';
  document.querySelector('.profile-stats').style.display = 'none';
  document.querySelector('.post-box').style.display = 'none';
});

document.getElementById('submitPost').addEventListener('click', function() {
  const postContent = document.getElementById('postContent').value;
  const username = document.getElementById('profileName').textContent;  
  const timestamp = new Date().toLocaleString();  

  if (postContent.trim()) {
    const post = {
      content: postContent,
      username: username,
      timestamp: timestamp,
      upvotes: 0,
      downvotes: 0,
      comments: []
    };

    posts.push(post);
    displayPosts();

    document.getElementById('postCount').textContent = posts.length;
    document.getElementById('postSection').style.display = 'none';
    document.querySelector('.profile-header').style.display = 'flex';
    document.querySelector('.profile-stats').style.display = 'flex';
    document.querySelector('.post-box').style.display = 'block';
    document.getElementById('postContent').value = '';
  }
});

function displayPosts() {
  const postBox = document.getElementById('postBox');
  postBox.innerHTML = '';  

  posts.forEach(function(post, index) {
    const postItem = document.createElement('div');
    postItem.classList.add('post-item');

    const postMeta = document.createElement('div');
    postMeta.classList.add('post-meta');
    postMeta.textContent = `${post.username} • ${post.timestamp}`;
    postItem.appendChild(postMeta);

    const postText = document.createElement('p');
    postText.textContent = post.content;
    postItem.appendChild(postText);

    const voteButtons = document.createElement('div');
    voteButtons.classList.add('vote-buttons');

    const upvoteButton = document.createElement('button');
    upvoteButton.classList.add('upvote-button');
    upvoteButton.textContent = 'Upvote';
    upvoteButton.addEventListener('click', function() {
      post.upvotes++;
      displayPosts(); 
    });

    const downvoteButton = document.createElement('button');
    downvoteButton.classList.add('downvote-button');
    downvoteButton.textContent = 'Downvote';
    downvoteButton.addEventListener('click', function() {
      post.downvotes++;
      displayPosts(); 
    });

    const voteCount = document.createElement('div');
    voteCount.classList.add('vote-count');
    voteCount.textContent = `Upvotes: ${post.upvotes} | Downvotes: ${post.downvotes}`;

    voteButtons.appendChild(upvoteButton);
    voteButtons.appendChild(downvoteButton);
    voteButtons.appendChild(voteCount);
    postItem.appendChild(voteButtons);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
      posts.splice(index, 1);  
      displayPosts();  
    });
    postItem.appendChild(deleteButton);

    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');
    
    const commentInput = document.createElement('input');
    commentInput.placeholder = 'Write a comment...';
    commentInput.classList.add('comment-input');

    const commentButton = document.createElement('button');
    commentButton.textContent = 'Comment';
    commentButton.classList.add('comment-button');
    commentButton.addEventListener('click', function() {
      const commentText = commentInput.value.trim();
      if (commentText) {
        post.comments.push({ text: commentText, timestamp: new Date().toLocaleString() });
        displayPosts();  
      }
    });

    commentSection.appendChild(commentInput);
    commentSection.appendChild(commentButton);

    post.comments.forEach(function(comment) {
      const commentItem = document.createElement('div');
      commentItem.classList.add('comment-item');
      commentItem.textContent = `${comment.text} • ${comment.timestamp}`;
      commentSection.appendChild(commentItem);
    });

    postItem.appendChild(commentSection);
    postBox.appendChild(postItem);
  });
}

document.getElementById('friendsButton').addEventListener('click', function() {
  document.getElementById('friendsPopup').style.display = 'flex';
});

document.getElementById('closeFriendsPopup').addEventListener('click', function() {
  document.getElementById('friendsPopup').style.display = 'none';
});

window.addEventListener('click', function(event) {
  const popup = document.getElementById('friendsPopup');
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});

document.getElementById('inboxButton').addEventListener('click', function() {
  document.getElementById('inboxPopup').style.display = 'flex';
});

document.getElementById('closeInboxPopup').addEventListener('click', function() {
  document.getElementById('inboxPopup').style.display = 'none';
});

window.addEventListener('click', function(event) {
  const popup = document.getElementById('inboxPopup');
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});

document.getElementById('searchButton').addEventListener('click', function() {
  document.getElementById('searchPopup').style.display = 'flex';
});

document.getElementById('closeSearchPopup').addEventListener('click', function() {
  document.getElementById('searchPopup').style.display = 'none';
});

window.addEventListener('click', function(event) {
  const popup = document.getElementById('searchPopup');
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});

document.getElementById('searchSubmit').addEventListener('click', function() {
  const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = '';

  if (searchQuery) {
    const result = posts.filter(post => post.content.toLowerCase().includes(searchQuery));
    if (result.length > 0) {
      result.forEach(post => {
        const resultItem = document.createElement('p');
        resultItem.textContent = `Found Post: ${post.content}`;
        searchResultsDiv.appendChild(resultItem);
      });
    } else {
      searchResultsDiv.textContent = 'No results found.';
    }
  } else {
    searchResultsDiv.textContent = 'Please enter a search term.';
  }
});
