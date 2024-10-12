import { renderHTML } from '../app.js';

function setupNavbarElements(activePage) {
  const buttons = {
    home: { button: document.getElementById('navHome'), page: "home.html" },
    messages: { button: document.getElementById('navMessages'), page: "messages.html" },
    createPost: { button: document.getElementById('navCreatePost'), page: "createPost.html" },
    settings: { button: document.getElementById('navSettings'), page: "settings.html" },
    profile: { button: document.getElementById('navProfileButton'), page: "profile.html" } 
  };

  buttons[activePage].button.style.backgroundColor = '#0056b3';
  buttons[activePage].button.style.cursor = 'default';
  delete buttons[activePage];
  
  Object.keys(buttons).forEach(buttonID => {
    const { button, page } = buttons[buttonID];

    button.addEventListener('click', () => {
      renderHTML(page);
    });
  });
}

export { setupNavbarElements };
