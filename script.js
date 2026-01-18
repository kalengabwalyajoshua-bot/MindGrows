// ============================
// GLOBAL SCREEN HANDLER
// ============================
const screens = document.querySelectorAll(".screen");
let currentSubject = null;

function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

// ============================
// USER DATA (AI MEMORY PER SUBJECT)
// ============================
const userData = JSON.parse(localStorage.getItem("mindglowUser")) || {
  visits: 0,
  subjects: {},       // Tracks clicks per category/subject
  questionsAsked: 0,  // Total questions asked
  chatHistory: {}     // Chat per subject
};

function saveUserData() {
  localStorage.setItem("mindglowUser", JSON.stringify(userData));
}

// ============================
// START FLOW
// ============================
document.getElementById("startBtn").onclick = () => showScreen("signupScreen");

document.getElementById("signupBtn").onclick = () => {
  const fullName = document.getElementById("fullName").value.trim();
  const schoolName = document.getElementById("schoolName").value.trim();
  const className = document.getElementById("className").value.trim();
  
  if (!fullName || !schoolName || !className) {
    alert("Please fill in all fields.");
    return;
  }

  userData.visits++;
  userData.profile = { fullName, schoolName, className };
  saveUserData();
  showScreen("homeScreen");
};

// ============================
// BOTTOM NAVIGATION
// ============================
const navMap = {
  Home: "homeScreen",
  Explore: "categoryScreen",
  Profile: "profileScreen",
  Friends: "friendsScreen",
  Messages: "aiChatScreen"
};

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const targetScreen = navMap[btn.textContent.trim()];
    if (targetScreen) showScreen(targetScreen);
  };
});

// ============================
// CATEGORY BUTTONS → SUBJECTS
// ============================
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.onclick = () => {
    const category = btn.textContent.trim();
    userData.subjects[category] = (userData.subjects[category] || 0) + 1;
    saveUserData();
    showScreen("subjectScreen");
  };
});

// ============================
// SUBJECT BUTTONS → AI CHAT
// ============================
document.querySelectorAll(".subject-btn").forEach(btn => {
  btn.onclick = () => {
    currentSubject = btn.textContent.trim();
    // Initialize chat history if not exists
    if (!userData.chatHistory[currentSubject]) userData.chatHistory[currentSubject] = [];
    saveUserData();
    showScreen("aiChatScreen");
    loadChatHistory();
  };
});

// ============================
// LOAD CHAT HISTORY FOR CURRENT SUBJECT
// ============================
function loadChatHistory() {
  const chatContainer = document.querySelector(".chat-container");
  chatContainer.innerHTML = ""; // Clear old messages
  const history = userData.chatHistory[currentSubject] || [];
  
  history.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = "chat-message";
    bubble.textContent = msg;
    chatContainer.appendChild(bubble);
  });

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ============================
// AI CHAT FUNCTIONALITY
// ============================
document.getElementById("sendChatBtn").onclick = () => {
  const input = document.querySelector(".chat-input input");
  const chat = document.querySelector(".chat-container");
  const msg = input.value.trim();
  if (!msg || !currentSubject) return;

  // Track questions asked
  userData.questionsAsked++;

  // User message
  const userBubble = "You: " + msg;
  userData.chatHistory[currentSubject].push(userBubble);

  const userDiv = document.createElement("div");
  userDiv.className = "chat-message";
  userDiv.textContent = userBubble;
  chat.appendChild(userDiv);

  // AI response
  const favSubject = Object.entries(userData.subjects)
    .sort((a,b)=>b[1]-a[1])[0]?.[0];

  const aiBubble = favSubject
    ? `AI: I see you're focusing on ${favSubject}. Keep going!`
    : "AI: I'm learning how you study. Ask me anything.";

  userData.chatHistory[currentSubject].push(aiBubble);

  const aiDiv = document.createElement("div");
  aiDiv.className = "chat-message";

  setTimeout(() => {
    aiDiv.textContent = aiBubble;
    chat.appendChild(aiDiv);
    chat.scrollTop = chat.scrollHeight;
    saveUserData();
  }, 600);

  input.value = "";
};

// ============================
// VOICE BUTTON (PLACEHOLDER)
// ============================
document.getElementById("voiceBtn").onclick = () => {
  alert("Voice AI coming soon.");
};
