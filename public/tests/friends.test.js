/**
 * @jest-environment jsdom
 */

import { loadGlobalUsers } from '../js/friends.js'; 
import { auth, db, collection, doc, onAuthStateChanged, getDocs, getDoc, setDoc } from '../js/firebase.js';

jest.mock('../js/firebase.js', () => ({
    auth: { currentUser: { uid: "currentUserID" } },
    db: {},
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    onAuthStateChanged: jest.fn(),
  }));
  

describe("Friends functionality", () => {
  let userList;

  beforeEach(() => {
    // Set up DOM elements
    document.body.innerHTML = `
      <div id="userList"></div>
    `;
    userList = document.getElementById('userList');
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = ''; // Clean up the DOM
  });

  describe("loadGlobalUsers", () => {
    test("should load users from Firestore and render them", async () => {
      const mockUsers = [
        { id: "user1", data: () => ({ full_name: "User One", email: "user1@example.com" }) },
        { id: "user2", data: () => ({ full_name: "User Two", email: "user2@example.com" }) },
      ];

      getDocs.mockResolvedValueOnce({ docs: mockUsers });
      getDoc.mockResolvedValueOnce({ exists: () => false }); // User1 not a friend
      getDoc.mockResolvedValueOnce({ exists: () => true });  // User2 is a friend

      await loadGlobalUsers();

      const users = userList.querySelectorAll('.user');
      expect(users.length).toBe(2);

      // Validate the first user's data
      expect(users[0].querySelector('h3').textContent).toBe("User One");
      expect(users[0].querySelector('.addFriend')).toBeTruthy(); // Add Friend button exists

      // Validate the second user's data
      expect(users[1].querySelector('h3').textContent).toBe("User Two");
      expect(users[1].querySelector('.friends')).toBeTruthy(); // Friends button exists
    });

    test("should handle missing userList element in DOM", async () => {
      document.body.innerHTML = ''; // Remove userList
      expect(async () => await loadGlobalUsers()).not.toThrow();
    });

    test("should skip current user from the list", async () => {
      const mockUsers = [
        { id: "currentUserID", data: () => ({ full_name: "Current User", email: "current@example.com" }) },
        { id: "user1", data: () => ({ full_name: "User One", email: "user1@example.com" }) },
      ];

      getDocs.mockResolvedValueOnce({ docs: mockUsers });
      getDoc.mockResolvedValueOnce({ exists: () => false });

      await loadGlobalUsers();

      const users = userList.querySelectorAll('.user');
      expect(users.length).toBe(1); // Only one user rendered (not current user)
      expect(users[0].querySelector('h3').textContent).toBe("User One");
    });

    test("should display an error if getDocs fails", async () => {
      console.error = jest.fn();
      getDocs.mockRejectedValueOnce(new Error("Firestore error"));

      await loadGlobalUsers();

      expect(console.error).toHaveBeenCalledWith("Error fetching global users:", expect.any(Error));
      expect(userList.innerHTML).toBe(''); // No users rendered
    });
  });

  describe("addFriend", () => {
    const mockSetDoc = setDoc.mockResolvedValueOnce();

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("should add a friend and update the UI", async () => {
      const addFriend = require('../js/friends.js').addFriend; // Dynamically import to avoid issues with order

      const addFriendButton = document.createElement('button');
      addFriendButton.classList.add('addFriend');
      userList.appendChild(addFriendButton);

      await addFriend("currentUserID", "user2ID");

      expect(setDoc).toHaveBeenCalledTimes(2); // Update both users' friends subcollections
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { addedAt: expect.any(Date) }
      );

      // Validate button changes
      expect(addFriendButton.textContent).toBe('Friends');
      expect(addFriendButton.disabled).toBe(true);
      expect(addFriendButton.style.backgroundColor).toBe('#0056b3');
    });

    test("should display an error if setDoc fails", async () => {
      console.error = jest.fn();
      setDoc.mockRejectedValueOnce(new Error("Firestore error"));

      const addFriend = require('../js/friends.js').addFriend;

      await addFriend("currentUserID", "user2ID");

      expect(console.error).toHaveBeenCalledWith("Error adding friend:", expect.any(Error));
    });
  });

  describe("checkIfFriends", () => {
    const checkIfFriends = require('../js/friends.js').checkIfFriends;

    test("should return true if users are friends", async () => {
      getDoc.mockResolvedValueOnce({ exists: () => true });

      const result = await checkIfFriends("currentUserID", "user2ID");
      expect(result).toBe(true);
    });

    test("should return false if users are not friends", async () => {
      getDoc.mockResolvedValueOnce({ exists: () => false });

      const result = await checkIfFriends("currentUserID", "user2ID");
      expect(result).toBe(false);
    });

    test("should handle errors gracefully", async () => {
      console.error = jest.fn();
      getDoc.mockRejectedValueOnce(new Error("Firestore error"));

      const result = await checkIfFriends("currentUserID", "user2ID");

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith("Error checking friends:", expect.any(Error));
    });
  });
});
