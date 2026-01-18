// ============================
// GLOBAL SCREEN HANDLER
// ============================

const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

// ============================
// USER DATA (AI MEMORY)
// ============================

const userData = JSON.parse(localStorage.getItem("mindglowUser")) || {
  visits: 0,
  subjects: {},
  questionsAsked: 0
};

function saveUserData() {
  localStorage.setItem("mindglowUser", JSON.stringify(userData));
}

// ============================
// START FLOW
// ============================

document.getElementById("startBtn").onclick = () => {
  showScreen("signupScreen");
};

document.getElementById("signupBtn").onclick = () => {
  userData.visits++;
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
    // Track category click
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
    const subject = btn.textContent.trim();
    userData.subjects[subject] = (userData.subjects[subject] || 0) + 1;
    saveUserData();
    showScreen("aiChatScreen");
  };
});

// ============================
// AI CHAT FUNCTIONALITY
// ============================

document.getElementById("sendChatBtn").onclick = () => {
  const input = document.querySelector(".chat-input input");
  const chat = document.querySelector(".chat-container");
  const msg = input.value.trim();
  if (!msg) return;

  // Track questions asked
  userData.questionsAsked++;
  saveUserData();

  // User message
  const userBubble = document.createElement("div");
  userBubble.className = "chat-message";
  userBubble.textContent = "You: " + msg;
  chat.appendChild(userBubble);

  // AI message
  const aiBubble = document.createElement("div");
  aiBubble.className = "chat-message";

  const favSubject = Object.entries(userData.subjects)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  aiBubble.textContent = favSubject
    ? `AI: I noticed you focus a lot on ${favSubject}. Want to practice it more?`
    : "AI: I'm learning how you study. Ask me anything.";

  setTimeout(() => {
    chat.appendChild(aiBubble);
    chat.scrollTop = chat.scrollHeight;
  }, 600);

  input.value = "";
};

// ============================
// VOICE BUTTON (PLACEHOLDER)
// ============================

document.getElementById("voiceBtn").onclick = () => {
  alert("Voice AI coming soon.");
};
