/**
 * @jest-environment jsdom
 */

import { updatePassword, updateEmailPreferences } from '../js/settings.js'; 
import { updatePassword as fbUpdatePassword, updateEmailPreferences as fbUpdateEmailPreferences } from '../js/firebase.js'; 
import { setupSettingsElements } from '../js/settings.js';

jest.mock('../js/firebase.js', () => ({
  updatePassword: jest.fn(),
  updateEmailPreferences: jest.fn(),
}));

describe("setupSettingsPage", () => {
  beforeEach(() => {
    // Set up the DOM structure for the settings page
    document.body.innerHTML = `
      <div id="settingsPage">
        <input id="currentPassword" type="password" placeholder="Current Password" />
        <input id="newPassword" type="password" placeholder="New Password" />
        <button id="changePasswordButton">Change Password</button>
        
        <label>
          <input id="emailNotifications" type="checkbox" />
          Email Notifications
        </label>
        <button id="savePreferencesButton">Save Preferences</button>
        
        <div id="message"></div>
      </div>
    `;
    setupSettingsPage();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should show an error if the current password field is empty during password change", () => {
    const newPasswordInput = document.getElementById("newPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const messageDiv = document.getElementById("message");

    newPasswordInput.value = "newPassword123";
    changePasswordButton.click();

    expect(messageDiv.textContent).toBe("Please enter your current password.");
  });

  test("should show an error if the new password field is empty during password change", () => {
    const currentPasswordInput = document.getElementById("currentPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const messageDiv = document.getElementById("message");

    currentPasswordInput.value = "currentPassword123";
    changePasswordButton.click();

    expect(messageDiv.textContent).toBe("Please enter a new password.");
  });

  test("should call API to update password with correct inputs", async () => {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");

    currentPasswordInput.value = "currentPassword123";
    newPasswordInput.value = "newPassword123";

    updatePassword.mockResolvedValueOnce("Password changed successfully.");
    await changePasswordButton.click();

    expect(updatePassword).toHaveBeenCalledWith("currentPassword123", "newPassword123");
  });

  test("should display error message if password update fails", async () => {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const messageDiv = document.getElementById("message");

    currentPasswordInput.value = "currentPassword123";
    newPasswordInput.value = "newPassword123";

    updatePassword.mockRejectedValueOnce(new Error("Password update failed."));
    await changePasswordButton.click();

    expect(messageDiv.textContent).toBe("Password update failed.");
  });

  test("should toggle email preferences and call API", async () => {
    const emailNotificationsCheckbox = document.getElementById("emailNotifications");
    const savePreferencesButton = document.getElementById("savePreferencesButton");

    emailNotificationsCheckbox.checked = true;
    await savePreferencesButton.click();

    expect(updateEmailPreferences).toHaveBeenCalledWith(true);

    emailNotificationsCheckbox.checked = false;
    await savePreferencesButton.click();

    expect(updateEmailPreferences).toHaveBeenCalledWith(false);
  });

  test("should display error message if email preferences update fails", async () => {
    const emailNotificationsCheckbox = document.getElementById("emailNotifications");
    const savePreferencesButton = document.getElementById("savePreferencesButton");
    const messageDiv = document.getElementById("message");

    emailNotificationsCheckbox.checked = true;

    updateEmailPreferences.mockRejectedValueOnce(new Error("Email preferences update failed."));
    await savePreferencesButton.click();

    expect(messageDiv.textContent).toBe("Email preferences update failed.");
  });

  test("should disable change password button if inputs are invalid", () => {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");

    currentPasswordInput.value = "";
    newPasswordInput.value = "";

    changePasswordButton.click();

    expect(changePasswordButton.disabled).toBe(true);
  });

  test("should disable save preferences button if checkbox state doesn't change", () => {
    const emailNotificationsCheckbox = document.getElementById("emailNotifications");
    const savePreferencesButton = document.getElementById("savePreferencesButton");

    emailNotificationsCheckbox.checked = false; // Default state
    savePreferencesButton.click();

    expect(savePreferencesButton.disabled).toBe(true);
  });

  test("should display success message on password change", async () => {
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const messageDiv = document.getElementById("message");

    currentPasswordInput.value = "currentPassword123";
    newPasswordInput.value = "newPassword123";

    updatePassword.mockResolvedValueOnce("Password changed successfully.");
    await changePasswordButton.click();

    expect(messageDiv.textContent).toBe("Password changed successfully.");
  });

  test("should display success message on email preferences update", async () => {
    const emailNotificationsCheckbox = document.getElementById("emailNotifications");
    const savePreferencesButton = document.getElementById("savePreferencesButton");
    const messageDiv = document.getElementById("message");

    emailNotificationsCheckbox.checked = true;

    updateEmailPreferences.mockResolvedValueOnce("Preferences updated successfully.");
    await savePreferencesButton.click();

    expect(messageDiv.textContent).toBe("Preferences updated successfully.");
  });
  test("should show a warning when trying to save invalid email preferences", () => {
    setupSettingsPage();
  
    const saveButton = document.getElementById('savePreferences');
    const warningMessage = document.getElementById('preferencesWarning');
  
    saveButton.click();
    expect(warningMessage.textContent).toContain("Invalid preferences selected");
  });
  
  test("should reset all fields when the reset button is clicked", () => {
    setupSettingsPage();
  
    const resetButton = document.getElementById('resetPreferences');
    document.getElementById('emailPreference').checked = true;
  
    resetButton.click();
    const emailPreference = document.getElementById('emailPreference');
    expect(emailPreference.checked).toBe(false); // Reset checkbox
  });
  
});
