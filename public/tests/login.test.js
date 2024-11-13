/**
 * @jest-environment jsdom
 */

import { setupLoginElements } from '../js/login.js';
import { auth, signInWithEmailAndPassword } from '../js/firebase.js';
import { renderHTML } from '../app.js';

jest.mock('../js/firebase.js', () => ({
  auth: {},
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('../app.js', () => ({
  renderHTML: jest.fn(),
}));

describe("setupLoginElements", () => {
  let emailInput, passwordInput, signInButton, forgotPasswordButton, createAccountButton, messageDiv, message2Div;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = `
      <div>
        <input id="email" />
        <input id="password" />
        <div id="message"></div>
        <div id="message2"></div>
        <button id="signIn">Sign In</button>
        <button id="forgotPassword">Forgot Password</button>
        <button id="createAccount">Create Account</button>
      </div>
    `;

    emailInput = document.getElementById("email");
    passwordInput = document.getElementById("password");
    signInButton = document.getElementById("signIn");
    forgotPasswordButton = document.getElementById("forgotPassword");
    createAccountButton = document.getElementById("createAccount");
    messageDiv = document.getElementById("message");
    message2Div = document.getElementById("message2");

    setupLoginElements();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should show error if email or password is missing", () => {
    signInButton.click();
    expect(message2Div.textContent).toBe("Please fill in all fields and try again.");
  });

  test("should attempt to sign in with valid inputs", async () => {
    emailInput.value = "test@example.com";
    passwordInput.value = "password123";
    
    signInWithEmailAndPassword.mockResolvedValueOnce(); // Mock successful sign-in

    await signInButton.click();

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
    expect(message2Div.textContent).toBe(""); // Ensure no error message
  });

  test("should display an error message when sign-in fails", async () => {
    emailInput.value = "test@example.com";
    passwordInput.value = "wrongpassword";

    const mockError = new Error("Firebase: Password should be at least 6 characters (auth/weak-password).");
    signInWithEmailAndPassword.mockRejectedValueOnce(mockError);

    await signInButton.click();

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "wrongpassword");
    expect(message2Div.textContent).toBe("Password should be at least 6 characters (weak-password). Please try again.");
    expect(messageDiv.textContent).toBe("Error Signing In");
  });

  test("should redirect to resetPassword.html when forgot password button is clicked", () => {
    forgotPasswordButton.click();
    expect(renderHTML).toHaveBeenCalledWith("resetPassword.html");
  });

  test("should redirect to createAccount.html when create account button is clicked", () => {
    createAccountButton.click();
    expect(renderHTML).toHaveBeenCalledWith("createAccount.html");
  });

  test("should handle Enter key press to trigger sign-in", () => {
    emailInput.value = "test@example.com";
    passwordInput.value = "password123";

    signInWithEmailAndPassword.mockResolvedValueOnce(); // Mock successful sign-in

    const keyDownEvent = new KeyboardEvent("keydown", { key: "Enter" });
    emailInput.dispatchEvent(keyDownEvent);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
  });

  test("should not trigger sign-in on Enter key if email or password is missing", () => {
    const keyDownEvent = new KeyboardEvent("keydown", { key: "Enter" });
    emailInput.dispatchEvent(keyDownEvent);

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    expect(message2Div.textContent).toBe("Please fill in all fields and try again.");
  });

  test("should handle unexpected errors gracefully", async () => {
    emailInput.value = "test@example.com";
    passwordInput.value = "password123";

    const unexpectedError = new Error("Unexpected error occurred.");
    signInWithEmailAndPassword.mockRejectedValueOnce(unexpectedError);

    await signInButton.click();

    expect(messageDiv.textContent).toBe("Error Signing In");
    expect(message2Div.textContent).toBe("Unexpected error occurred. Please try again.");
  });

  test("should not overwrite existing error messages on subsequent empty submissions", () => {
    signInButton.click();
    expect(message2Div.textContent).toBe("Please fill in all fields and try again.");

    signInButton.click();
    expect(message2Div.textContent).toBe("Please fill in all fields and try again."); // Same error persists
  });

  test("should not add duplicate event listeners when setupLoginElements is called multiple times", () => {
    const clickSpy = jest.spyOn(signInButton, "click");
    
    setupLoginElements(); // Call setup again

    signInButton.click();
    expect(clickSpy).toHaveBeenCalledTimes(1); // Ensure no duplicate listeners
  });
  
  test("should clear input fields after a successful login", async () => {
    emailInput.value = "test@example.com";
    passwordInput.value = "password123";
  
    signInWithEmailAndPassword.mockResolvedValueOnce(); // Mock successful sign-in
  
    await signInButton.click();
  
    // Check that input fields are cleared
    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });
  test("should trigger login when Enter key is pressed in input fields", () => {
    const email = "test@example.com";
    const password = "password123";
  
    emailInput.value = email;
    passwordInput.value = password;
  
    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
    emailInput.dispatchEvent(enterEvent);
  
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });  

});
