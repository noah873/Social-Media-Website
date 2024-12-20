import { renderHTML } from '../app.js';

/* Builder Design Pattern (Creational) - The setupNavbarElements function follows the Builder Pattern
as it separates the construction of the buttons' event listeners from its representations. These buttons are dynamically setup
with event listeners if they are not the active page and each background color and cursor configuration is also set accordingly.
Each navbar for each page can be built using this same process, exemplifying the Builder Pattern and bringing meaningful flexibility.
*/
function setupNavbarElements(activePage) {
  const buttons = {
    home: { button: document.getElementById('navHome'), page: "home.html" },
    messages: { button: document.getElementById('navMessages'), page: "messages.html" },
    friends: { button: document.getElementById('navFriends'), page: "friends.html" },
    search: { button: document.getElementById('navSearch'), page: "search.html" },
    createPost: { button: document.getElementById('navCreatePost'), page: "createPost.html" },
    profile: { button: document.getElementById('navProfile'), page: "profile.html" } ,
    settings: { button: document.getElementById('navSettings'), page: "settings.html" }
  };
  
  const activeButton = buttons[activePage].button;  
  activeButton.style.backgroundColor = '#0056b3'; // set the color of the active page button to look like its depressed (darker blue)
  activeButton.style.cursor = 'default'; // remove mouseover selection visual
  delete buttons[activePage]; // to prevent the creation of an event listener to redirect to that page as the user is already on it
  
  Object.keys(buttons).forEach(buttonID => {
    const { button, page } = buttons[buttonID];
    
    button.addEventListener('click', () => renderHTML(page));

    // Reset to CSS File Defaults
    button.style.backgroundColor = '#007bff';
    button.style.cursor = 'pointer';
  });
}

export { setupNavbarElements };
