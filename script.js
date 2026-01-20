// === EchoAI Script.js ===

// Select elements
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const storiesPanel = document.getElementById('storiesPanel');
const storiesBtn = document.getElementById('storiesBtn');
const closeStories = document.getElementById('closeStories');
const voiceGlow = document.getElementById('voiceGlow');
const tabButtons = document.querySelectorAll('.tab-btn');

// === Chat Handling ===
function appendMessage(text, sender='ai') {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message', sender);
  msgDiv.innerText = text;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// === Simple AI Responses ===
function getAIResponse(input) {
  input = input.toLowerCase();
  
  if(input.includes('story')) {
    storiesPanel.style.display = 'flex';
    return "Opening bedtime stories for you!";
  } 
  else if(input.includes('hello') || input.includes('hi')) {
    return "Hello Joshua! How are you feeling today?";
  }
  else if(input.includes('music')) {
    return "Playing relaxing music for you now...";
  }
  else if(input.includes('video') || input.includes('camera')) {
    return "Activating video analyzer. Please allow camera access.";
  }
  else if(input.includes('how are you')) {
    return "I’m always ready to assist you, Joshua!";
  }
  else {
    return "I hear you, Joshua! Let's dive deeper into that...";
  }
}

// === Send Button & Enter Key ===
sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if(text) {
    appendMessage(text, 'user');
    const response = getAIResponse(text);
    setTimeout(() => appendMessage(response, 'ai'), 500);
    userInput.value = '';
  }
});

userInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') sendBtn.click();
});

// === Bedtime Stories Panel ===
storiesBtn.addEventListener('click', () => {
  storiesPanel.style.display = 'flex';
});

closeStories.addEventListener('click', () => {
  storiesPanel.style.display = 'none';
});

// === Voice Glow (Simulated Voice Command) ===
voiceGlow.addEventListener('click', () => {
  appendMessage("🎤 Listening for your voice command...", 'ai');
  voiceGlow.style.animation = 'pulse 1s infinite alternate';
  setTimeout(() => {
    appendMessage("I understood your command! Processing...", 'ai');
    voiceGlow.style.animation = 'pulse 2s infinite';
  }, 2000);
});

// === Tab Buttons Functionality ===
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    appendMessage(`Switched to ${tab} tab`, 'ai');
    if(tab === 'music') appendMessage("Music player ready to play your favorite tracks!", 'ai');
    if(tab === 'video') appendMessage("Video analyzer activated! Point your camera to start.", 'ai');
    if(tab === 'notifications') appendMessage("Notifications panel opened.", 'ai');
  });
});

// === Video Analyzer Skeleton (Placeholder) ===
async function startVideoAnalyzer() {
  appendMessage("Requesting camera access...", 'ai');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    appendMessage("Camera access granted! Analyzing...", 'ai');
    // Placeholder for analysis logic
  } catch (err) {
    appendMessage("Camera access denied or not available.", 'ai');
  }
}

// === Automatic Greetings on Load ===
window.addEventListener('load', () => {
  appendMessage("Welcome back, Joshua! EchoAI is online.", 'ai');
  appendMessage("You can ask me to tell stories, play music, or analyze videos.", 'ai');
});

// === Smooth Scroll for Chat ===
chatArea.addEventListener('DOMNodeInserted', (event) => {
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
});

// === Example Bedtime Story Player (Simulated) ===
function playStory(storyId) {
  const storyText = document.getElementById(storyId).innerText;
  appendMessage(`Playing story: ${storyText}`, 'ai');
  // Simulated audio effect
  setTimeout(() => appendMessage("✨ Story finished. Hope you enjoyed it!", 'ai'), 4000);
}

// === Optional: Keyboard Shortcuts ===
document.addEventListener('keydown', (e) => {
  if(e.key === 'F1') storiesPanel.style.display = 'flex';
  if(e.key === 'Escape') storiesPanel.style.display = 'none';
});
