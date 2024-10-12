import { renderHTML } from '../app.js';

function setupNavbarElements(activePage) {
  const buttons = {
    home: { button: document.getElementById('navHome'), page: "home.html" },
    messages: { button: document.getElementById('navMessages'), page: "messages.html" },
    createPost: { button: document.getElementById('navCreatePost'), page: "createPost.html" },
    profile: { button: document.getElementById('navProfile'), page: "profile.html" } ,
    settings: { button: document.getElementById('navSettings'), page: "settings.html" }
  };

  buttons[activePage].button.style.backgroundColor = '#0056b3'; // set the color of the active page button to look like its depressed (darker blue)
  buttons[activePage].button.style.cursor = 'default'; // remove mouseover selection visual
  delete buttons[activePage]; // to prevent the creation of an event listener to redirect to that page as the user is already on it
  
  Object.keys(buttons).forEach(buttonID => {
    const { button, page } = buttons[buttonID];

    button.addEventListener('click', () => {
      renderHTML(page);
    });
  });
}

export { setupNavbarElements };
