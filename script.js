// script.js

// Function to handle screen navigation
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
  });
  const activeScreen = document.getElementById(screenId);
  if (activeScreen) {
    activeScreen.classList.add('active');
  }
}

// Event listener for 'Get Started' button
document.getElementById('startBtn').addEventListener('click', () => {
  showScreen('signupScreen');
});

// Event listener for 'Continue' button on the signup screen
document.getElementById('signupBtn').addEventListener('click', () => {
  // Here you can add form validation and data handling
  showScreen('homeScreen');
});

// Navigation for bottom nav buttons
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    showScreen(e.target.textContent.trim() + 'Screen');
  });
});

// Voice command button (placeholder for future functionality)
document.getElementById('voiceBtn').addEventListener('click', () => {
  // Future implementation for voice commands
  alert('Voice command feature coming soon!');
});

// AI Chat 'Send' button functionality (placeholder)
document.getElementById('sendChatBtn').addEventListener('click', () => {
  const chatInput = document.querySelector('.chat-input input');
  const message = chatInput.value.trim();
  if (message) {
    // Here you can add code to send the message to the AI and display the response
    const chatContainer = document.querySelector('.chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatInput.value = '';
  }
});
