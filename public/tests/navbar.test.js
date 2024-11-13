/**
 * @jest-environment jsdom
 */

import { setupNavbarElements } from '../js/navbar.js';
import { renderHTML } from '../app.js';

jest.mock('../app.js', () => ({
  renderHTML: jest.fn(),
}));

describe("setupNavbarElements", () => {
  beforeEach(() => {
    // Set up a mock DOM structure
    document.body.innerHTML = `
      <button id="navHome">Home</button>
      <button id="navMessages">Messages</button>
      <button id="navFriends">Friends</button>
      <button id="navSearch">Search</button>
      <button id="navCreatePost">Create Post</button>
      <button id="navProfile">Profile</button>
      <button id="navSettings">Settings</button>
    `;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should style the active page button correctly", () => {
    setupNavbarElements("home");

    const activeButton = document.getElementById('navHome');
    expect(activeButton.style.backgroundColor).toBe('#0056b3');
    expect(activeButton.style.cursor).toBe('default');
  });

  test("should add click event listeners to inactive buttons", () => {
    setupNavbarElements("home");

    const messagesButton = document.getElementById('navMessages');
    messagesButton.click();

    expect(renderHTML).toHaveBeenCalledWith("messages.html");
  });

  test("should reset styles for inactive buttons", () => {
    setupNavbarElements("home");

    const messagesButton = document.getElementById('navMessages');
    expect(messagesButton.style.backgroundColor).toBe('#007bff');
    expect(messagesButton.style.cursor).toBe('pointer');
  });

  test("should not throw errors if some buttons are missing", () => {
    document.getElementById('navMessages').remove(); // Simulate a missing button
    expect(() => setupNavbarElements("home")).not.toThrow();
  });

  test("should not add event listener to the active button", () => {
    setupNavbarElements("home");

    const activeButton = document.getElementById('navHome');
    const clickEvent = new MouseEvent('click');

    activeButton.dispatchEvent(clickEvent);

    expect(renderHTML).not.toHaveBeenCalled(); // No navigation for active button
  });
  test("should not add event listeners to buttons outside the defined set", () => {
    document.body.innerHTML += `<button id="extraButton">Extra</button>`; // Add an unrelated button
  
    setupNavbarElements("home");
  
    const extraButton = document.getElementById('extraButton');
    const clickEvent = new MouseEvent('click');
  
    extraButton.dispatchEvent(clickEvent);
    expect(renderHTML).not.toHaveBeenCalled(); // No action should occur for this button
  });
  
  test("should handle case when no active page is passed", () => {
    expect(() => setupNavbarElements()).not.toThrow();
  
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button.style.backgroundColor).toBe('#007bff'); // Default inactive color
      expect(button.style.cursor).toBe('pointer'); // Default cursor
    });
  });
  
  test("should render all buttons in an enabled state by default", () => {
    setupNavbarElements("home");
  
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button.disabled).toBe(false); // Ensure all buttons are enabled
    });
  });
  
  test("should dynamically highlight the active page", () => {
    setupNavbarElements("messages");
  
    const activeButton = document.getElementById('navMessages');
    expect(activeButton.style.backgroundColor).toBe('#0056b3'); // Highlighted active button
    expect(activeButton.style.cursor).toBe('default');
  });
  
  test("should handle multiple clicks on the same button gracefully", () => {
    setupNavbarElements("home");
  
    const activeButton = document.getElementById('navHome');
    activeButton.click(); // First click
    activeButton.click(); // Second click
  
    expect(renderHTML).not.toHaveBeenCalled(); // No navigation should occur
  });
  test("should not add event listeners if buttons lack an ID", () => {
  document.body.innerHTML += `<button>No ID</button>`; // Add button without an ID

  expect(() => setupNavbarElements("home")).not.toThrow();

  const noIDButton = document.querySelector('button:not([id])');
  noIDButton.click(); // Simulate click
  expect(renderHTML).not.toHaveBeenCalled();
});

test("should handle cases where 'activePage' does not match any button", () => {
  setupNavbarElements("nonexistentPage");

  const activeButton = document.querySelector('button[style*="background-color"]');
  expect(activeButton).toBeNull(); // No button should be styled
});

test("should style only the active button and reset other buttons", () => {
    setupNavbarElements("profile");
  
    // Active button styling
    const activeButton = document.getElementById("navProfile");
    expect(activeButton.style.backgroundColor).toBe("rgb(0, 86, 179)"); // Matches the DOM output format
    expect(activeButton.style.cursor).toBe("default");
  
    // Other buttons reset to default
    const otherButtons = ["navHome", "navMessages", "navFriends", "navSearch", "navCreatePost", "navSettings"]
      .map(id => document.getElementById(id));
  
    otherButtons.forEach(button => {
      expect(button.style.backgroundColor).toBe("rgb(0, 123, 255)");
      expect(button.style.cursor).toBe("pointer");
    });
  });
  
});
