function setupCreateAccountElements() {
  const messageDiv = document.getElementById('message');

  const  = document.getElementById('');
  const  = document.getElementById('');
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  const createAccountButton = document.getElementById('createAccount');
  
  createAccountButton.addEventListener('click', () => {
      const email = emailInput.value;
      const password = passwordInput.value;

      createUserWithEmailAndPassword(auth, email, password)
        .catch(() => {
            messageDiv.textContent = 'Error Creating Account';
        });
  });
}
