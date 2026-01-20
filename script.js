// ==========================
// ECHOAI FULLY FUNCTIONAL SCRIPT.JS
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  const primaryButtons = document.querySelectorAll("[data-go]");
  const voiceBtn = document.querySelector(".voice-btn");
  const thinkingState = document.getElementById("voice-thinking");
  const speakingState = document.getElementById("voice-speaking");
  const chatInput = document.querySelector(".chat-input input");
  const chatBtn = document.querySelector(".chat-input button");
  const chatWindow = document.querySelector(".chat-window");
  const storyButtons = document.querySelectorAll("#screen-stories button");
  const musicListItems = document.querySelectorAll("#screen-music .list-item");
  const audiobookControls = document.querySelectorAll("#audiobook-reader button");
  const moodLabel = document.querySelector(".mood-label");
  const sleepBtn = document.querySelector("#screen-sleep .primary-btn");
  const cancelSleepBtn = document.querySelector("#screen-sleep .secondary-btn");
  const suggestionBtns = document.querySelectorAll(".chat-suggestions button");

  let currentAudio = null;
  const audioLibrary = {
    calm: "audio/calm.mp3",
    focus: "audio/focus.mp3",
    sleep: "audio/sleep.mp3",
    story1: "audio/story1.mp3",
    story2: "audio/story2.mp3",
    audiobook1: "audio/audiobook1.mp3",
    audiobook2: "audio/audiobook2.mp3"
  };

  // ================= SCREEN NAVIGATION =================
  primaryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-go");
      screens.forEach(s => s.classList.remove("active"));
      const targetScreen = document.getElementById(targetId);
      if (targetScreen) targetScreen.classList.add("active");
    });
  });

  // ================= VOICE INTERACTION =================
  voiceBtn.addEventListener("click", () => {
    switchScreen("screen-voice");
    thinkingState.classList.add("active");

    setTimeout(() => {
      thinkingState.classList.remove("active");
      speakingState.classList.add("active");

      // simulate spoken response
      const utterance = new SpeechSynthesisUtterance("Hello! I am EchoAI. How can I assist you today?");
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);

      utterance.onend = () => {
        speakingState.classList.remove("active");
        switchScreen("screen-home");
      };
    }, 2000);
  });

  // ================= CHAT FUNCTION =================
  chatBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addBubble("user", msg);
    chatInput.value = "";
    simulateAIResponse(msg);
  }

  function addBubble(type, text) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble", type);
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function simulateAIResponse(msg) {
    const aiMsg = generateResponse(msg.toLowerCase());
    addBubble("ai", aiMsg.text);
    if (aiMsg.audio) playAudio(aiMsg.audio);
  }

  function generateResponse(msg) {
    if (msg.includes("story")) return { text: "Starting your story...", audio: "story1" };
    if (msg.includes("music") || msg.includes("song")) return { text: "Playing relaxing music...", audio: "calm" };
    if (msg.includes("audiobook")) return { text: "Loading audiobook...", audio: "audiobook1" };
    if (msg.includes("mood")) return { text: `Your mood is ${moodLabel.textContent}`, audio: null };
    return { text: "I am here to help! You can ask for music, stories, or audiobooks.", audio: null };
  }

  // ================= STORIES =================
  storyButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const storyKey = `story${i + 1}`;
      playAudio(storyKey);
      addBubble("ai", `Playing story: ${btn.parentElement.querySelector("h3").textContent}`);
    });
  });

  // ================= MUSIC =================
  musicListItems.forEach(item => {
    item.addEventListener("click", () => {
      const type = item.textContent.toLowerCase().includes("calm") ? "calm" :
                   item.textContent.toLowerCase().includes("focus") ? "focus" :
                   "sleep";
      playAudio(type);
      addBubble("ai", `Playing ${type} music`);
    });
  });

  // ================= AUDIOBOOK =================
  audiobookControls.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.textContent;
      if (action === "⏯") {
        if (currentAudio && !currentAudio.paused) currentAudio.pause();
        else playAudio("audiobook1");
      } else if (action === "⏪") {
        if (currentAudio) currentAudio.currentTime -= 15;
      } else if (action === "⏩") {
        if (currentAudio) currentAudio.currentTime += 15;
      }
    });
  });

  // ================= MOOD DETECTION =================
  const moods = ["Calm", "Focused", "Energetic", "Sleepy", "Curious"];
  setInterval(() => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    moodLabel.textContent = randomMood;
    if (randomMood === "Sleepy") playAudio("sleep");
  }, 7000);

  // ================= SLEEP MODE =================
  sleepBtn.addEventListener("click", () => {
    switchScreen("screen-sleep");
    playAudio("sleep");
    document.body.style.transition = "background 5s";
    document.body.style.background = "#000";
  });

  cancelSleepBtn.addEventListener("click", () => {
    stopAudio();
    document.body.style.background = "#0a0a0a";
    switchScreen("screen-home");
  });

  // ================= SUGGESTIONS =================
  suggestionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const msg = btn.textContent;
      addBubble("user", msg);
      simulateAIResponse(msg);
    });
  });

  // ================= AUDIO PLAYBACK =================
  function playAudio(key) {
    stopAudio();
    if (!audioLibrary[key]) return;
    currentAudio = new Audio(audioLibrary[key]);
    currentAudio.loop = key === "calm" || key === "focus" || key === "sleep";
    currentAudio.play();
  }

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
  }

  // ================= HELPERS =================
  function switchScreen(id) {
    screens.forEach(s => s.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  }

  // ================= INITIAL SCREEN =================
  switchScreen("screen-welcome");
});
