// === EchoAI Full Stories & Audiobooks Script ===

// Elements
const chatArea = document.getElementById('chatArea');
const storiesPanel = document.getElementById('storiesPanel');
const storyButtons = document.querySelectorAll('.story');
const audioPlayer = new Audio();
audioPlayer.volume = 0.7;

// Story & Audiobook Files
const stories = {
  "Cinderella": "audio/stories/cinderella.mp3",
  "Red Riding Hood": "audio/stories/red_riding_hood.mp3",
  "Sleeping Beauty": "audio/stories/sleeping_beauty.mp3"
};

const audiobooks = {
  "Biology - Cells": "audio/audiobooks/cells.mp3",
  "Biology - Photosynthesis": "audio/audiobooks/photosynthesis.mp3",
  "Biology - Human Anatomy": "audio/audiobooks/human_anatomy.mp3"
};

// Append AI message
function appendMessage(text, sender='ai') {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message', sender);
  msgDiv.innerText = text;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Play a story or audiobook
function playAudio(name, type='story') {
  let filePath = type === 'story' ? stories[name] : audiobooks[name];
  if(!filePath) return appendMessage("Audio file not found.", 'ai');

  audioPlayer.src = filePath;
  audioPlayer.play();
  appendMessage(`🎧 Now playing: ${name}`, 'ai');

  audioPlayer.onended = () => {
    appendMessage(`✅ Finished playing: ${name}`, 'ai');
  }
}

// Bind story buttons
storyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const storyName = btn.innerText.split(":")[1].trim();
    playAudio(storyName, 'story');
  });
});

// Video Analyzer Integration Example
async function startVideoAnalyzer() {
  appendMessage("Requesting camera access...", 'ai');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    appendMessage("Camera access granted! Analyzing...", 'ai');
    // Placeholder: You could add object recognition here
    // Example: Recognize a plant leaf and link to photosynthesis audiobook
  } catch (err) {
    appendMessage("Camera access denied or not available.", 'ai');
  }
}

// Example: Chat Commands
function handleInput(input) {
  input = input.toLowerCase();
  if(input.includes('play story')) {
    appendMessage("Opening story panel...", 'ai');
    storiesPanel.style.display = 'flex';
  } else if(input.includes('play audiobook')) {
    const topic = input.split('play audiobook ')[1];
    playAudio(topic, 'audiobook');
  } else if(input.includes('video') || input.includes('camera')) {
    startVideoAnalyzer();
  } else {
    appendMessage("I hear you! Let's explore that...", 'ai');
  }
}

// Example Send Button
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');

sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if(!text) return;
  appendMessage(text, 'user');
  handleInput(text);
  userInput.value = '';
});

userInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') sendBtn.click();
});

// Optional: Keyboard shortcuts
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') storiesPanel.style.display = 'none';
});

// On Load
window.addEventListener('load', () => {
  appendMessage("Welcome Joshua! EchoAI is ready for stories, audiobooks, and video analysis.", 'ai');
});
