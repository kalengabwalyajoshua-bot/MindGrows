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
// START FLOW
// ============================

document.getElementById("startBtn").addEventListener("click", () => {
  showScreen("signupScreen");
});

document.getElementById("signupBtn").addEventListener("click", () => {
  // later: validation + backend
  showScreen("homeScreen");
});

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
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const targetScreen = navMap[btn.textContent.trim()];
    if (targetScreen) showScreen(targetScreen);
  });
});

// ============================
// CATEGORY BUTTONS → SUBJECTS
// ============================

document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showScreen("subjectScreen");
  });
});

// ============================
// SUBJECT BUTTONS → AI CHAT
// ============================

document.querySelectorAll(".subject-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showScreen("aiChatScreen");
  });
});

// ============================
// AI CHAT (LOCAL DEMO)
// ============================

document.getElementById("sendChatBtn").addEventListener("click", () => {
  const input = document.querySelector(".chat-input input");
  const message = input.value.trim();
  if (!message) return;

  const chat = document.querySelector(".chat-container");

  const userMsg = document.createElement("div");
  userMsg.className = "chat-message";
  userMsg.textContent = "You: " + message;

  chat.appendChild(userMsg);

  const aiMsg = document.createElement("div");
  aiMsg.className = "chat-message";
  aiMsg.textContent = "AI: I'm learning you. Real AI coming soon.";

  setTimeout(() => chat.appendChild(aiMsg), 600);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;
});

// ============================
// VOICE BUTTON (PLACEHOLDER)
// ============================

document.getElementById("voiceBtn").addEventListener("click", () => {
  alert("Voice AI will be added later.");
});
