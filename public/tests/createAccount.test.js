import { setupCreateAccountElements } from '../js/createAccount.js';
import { renderHTML } from '../app.js';
import { getDocs, createUserWithEmailAndPassword, setDoc } from '../js/firebase.js';

jest.mock('../js/firebase.js', () => ({
  getDocs: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('../app.js', () => ({
  renderHTML: jest.fn(),
}));

describe("setupCreateAccountElements", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <input id="fullName" />
        <input id="username" />
        <input id="email" />
        <input id="password" />
        <div id="message2"></div>
        <button id="createAccountButton"></button>
      </div>
    `;
    setupCreateAccountElements();
  });

  test("should show error if any input field is empty", () => {
    const createAccountButton = document.getElementById('createAccountButton');
    const messageDiv = document.getElementById('message2');

    createAccountButton.click();

    expect(messageDiv.textContent).toBe('Please fill in all fields and try again.');
  });

  test("should show error for duplicate username", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [{ data: () => ({ username: 'testUser' }) }],
    });

    const createAccountButton = document.getElementById('createAccountButton');
    const usernameInput = document.getElementById('username');
    const messageDiv = document.getElementById('message2');

    usernameInput.value = 'testUser';
    await createAccountButton.click();

    expect(messageDiv.textContent).toBe('Username already taken. Please try again.');
  });

  test("should attempt to create account with valid inputs", async () => {
    getDocs.mockResolvedValueOnce({ docs: [] }); // No duplicate usernames
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '123' } });
    setDoc.mockResolvedValueOnce();

    const createAccountButton = document.getElementById('createAccountButton');
    document.getElementById('fullName').value = 'John Doe';
    document.getElementById('username').value = 'johndoe';
    document.getElementById('email').value = 'john@example.com';
    document.getElementById('password').value = 'password123';

    await createAccountButton.click();

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      'john@example.com',
      'password123'
    );
    expect(setDoc).toHaveBeenCalled();
  });

  test("should show error if Firebase fails during account creation", async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Firebase error'));
    const messageDiv = document.getElementById('message2');
    const createAccountButton = document.getElementById('createAccountButton');

    await createAccountButton.click();

    expect(messageDiv.textContent).toContain('Error Creating Account');
  });

  test("should redirect to login page on login button click", () => {
    const loginButton = document.createElement('button');
    loginButton.id = 'login';
    document.body.appendChild(loginButton);

    setupCreateAccountElements();
    loginButton.click();

    expect(renderHTML).toHaveBeenCalledWith('login.html');
  });
  test("should disable the create account button until all fields are filled", () => {
    const createButton = document.getElementById('createAccountButton');
    const inputs = document.querySelectorAll('input');
  
    inputs.forEach(input => (input.value = "")); // Clear all inputs
    createButton.click();
    expect(createButton.disabled).toBe(true);
  
    document.getElementById('fullName').value = "Test User";
    createButton.click();
    expect(createButton.disabled).toBe(true); // Still disabled until all fields are filled
  });
  
  test("should hash the password before sending it to Firebase", async () => {
    const createButton = document.getElementById('createAccountButton');
    document.getElementById('password').value = "plainpassword";
  
    createUserWithEmailAndPassword.mockImplementationOnce(async (auth, email, password) => {
      expect(password).not.toBe("plainpassword"); // Ensure password is hashed
      return { user: { uid: "123" } };
    });
  
    createButton.click();
  });
  
});
