// ===================== SCRIPT.JS =====================
document.addEventListener("DOMContentLoaded", function() {
    // -----------------------------
    // SCREENS
    // -----------------------------
    const screens = {
        welcome: document.getElementById("welcomeScreen"),
        signup: document.getElementById("signupScreen"),
        home: document.getElementById("homeScreen"),
        subjects: document.getElementById("subjectsScreen"),
        chat: document.getElementById("chatScreen"),
        clubs: document.getElementById("clubsScreen"),
        assignments: document.getElementById("assignmentsScreen")
    };

    // -----------------------------
    // BUTTONS
    // -----------------------------
    const startBtn = document.getElementById("startBtn");
    const signupForm = document.getElementById("signupForm");

    const categoriesBtn = document.getElementById("categoriesBtn");
    const chatBtn = document.getElementById("chatBtn");
    const clubsBtn = document.getElementById("clubsBtn");
    const assignmentsBtn = document.getElementById("assignmentsBtn");
    const voiceBtn = document.getElementById("voiceBtn");

    const backBtns = document.querySelectorAll(".back-btn");

    const overlay = document.getElementById("overlay");
    const addFriendModal = document.getElementById("addFriendModal");
    const modalCloseBtns = document.querySelectorAll(".close-modal");

    // -----------------------------
    // HELPER: SHOW SCREEN
    // -----------------------------
    function showScreen(screen) {
        Object.values(screens).forEach(s => s.classList.remove("active"));
        screen.classList.add("active");
    }

    // -----------------------------
    // HELPER: TOAST POPUPS
    // -----------------------------
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 100);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    // -----------------------------
    // WELCOME → SIGNUP
    // -----------------------------
    startBtn.addEventListener("click", () => showScreen(screens.signup));

    // -----------------------------
    // SIGNUP → HOME
    // -----------------------------
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        showScreen(screens.home);
    });

    // -----------------------------
    // HOME BUTTONS → SCREENS
    // -----------------------------
    categoriesBtn.addEventListener("click", () => showScreen(screens.subjects));
    chatBtn.addEventListener("click", () => showScreen(screens.chat));
    clubsBtn.addEventListener("click", () => showScreen(screens.clubs));
    assignmentsBtn.addEventListener("click", () => showScreen(screens.assignments));

    // -----------------------------
    // BACK BUTTONS → HOME
    // -----------------------------
    backBtns.forEach(btn => {
        btn.addEventListener("click", () => showScreen(screens.home));
    });

    // -----------------------------
    // MODALS
    // -----------------------------
    modalCloseBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            addFriendModal.style.display = "none";
            overlay.style.display = "none";
        });
    });

    overlay.addEventListener("click", () => {
        addFriendModal.style.display = "none";
        overlay.style.display = "none";
    });

    // -----------------------------
    // VOICE CONTROL
    // -----------------------------
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;

    const synth = window.speechSynthesis;

    recognition.onresult = function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("You said:", transcript);

        // ---------- NAVIGATION ----------
        if (transcript.includes("go to home")) showScreen(screens.home);
        else if (transcript.includes("go to chat")) showScreen(screens.chat);
        else if (transcript.includes("go to subjects")) showScreen(screens.subjects);
        else if (transcript.includes("go to clubs")) showScreen(screens.clubs);
        else if (transcript.includes("go to exercises") || transcript.includes("go to assignments")) showScreen(screens.assignments);

        // ---------- QUOTE REPLY ----------
        else if (transcript.startsWith("quote")) {
            const response = transcript.replace("quote", "").trim();
            showToast(`You said: "${response}"`);
        }

        // ---------- SUGGESTION MODE ----------
        else if (transcript.includes("tell me what should i do")) {
            const suggestion = "Focus on learning a new topic today! Maybe try Mathematics or Physics!";
            showToast(suggestion); // shows toast
            const utter = new SpeechSynthesisUtterance(suggestion);
            synth.speak(utter);
        }

        // ---------- SAY SOMETHING ----------
        else if (transcript.startsWith("say")) {
            const textToSay = transcript.replace("say", "").trim();
            const utter = new SpeechSynthesisUtterance(textToSay);
            synth.speak(utter);
        }
    };

    // Start voice recognition
    function startVoiceControl() {
        recognition.start();
        voiceBtn.classList.add("active"); // Mic pulse
        showToast("Voice control activated! Speak your command.");

        recognition.onend = () => {
            voiceBtn.classList.remove("active"); // Stop mic pulse
        };
    }

    voiceBtn.addEventListener("click", startVoiceControl);

    // -----------------------------
    // READY FOR FUTURE FEATURES
    // -----------------------------
    // You can paste additional code below this line without breaking anything.
});
// ===================== NEW FEATURES =====================

// ----------- 1️⃣ PROFILE CUSTOMIZATION -----------
const profileName = document.querySelector("#profileScreen h2");
const profileSchool = document.querySelector("#profileScreen p");
const editProfileBtn = document.querySelector(".profile-btn");

editProfileBtn.addEventListener("click", () => {
    const newName = prompt("Enter your name:", profileName.innerText);
    const newSchool = prompt("Enter your school:", profileSchool.innerText);
    if(newName) profileName.innerText = newName;
    if(newSchool) profileSchool.innerText = newSchool;
});

// ----------- 2️⃣ DARK MODE TOGGLE -----------
const darkModeBtn = document.createElement("button");
darkModeBtn.innerText = "Dark Mode";
darkModeBtn.classList.add("primary-btn");
document.body.appendChild(darkModeBtn);

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    showToast(document.body.classList.contains("dark-mode") ? "Dark mode ON" : "Dark mode OFF");
});

// ----------- 3️⃣ QUICK VOICE NOTES -----------
let mediaRecorder;
let audioChunks = [];

const recordBtn = document.createElement("button");
recordBtn.innerText = "Record Note";
recordBtn.classList.add("primary-btn");
document.body.appendChild(recordBtn);

recordBtn.addEventListener("click", async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            };

            mediaRecorder.start();
            showToast("Recording started...");
            setTimeout(() => {
                mediaRecorder.stop();
                showToast("Recording finished, playing back...");
            }, 5000); // 5 sec note
        } catch (err) {
            showToast("Microphone access denied!");
        }
    }
});

// ----------- 4️⃣ QUICK CHAT REPLY -----------
const chatItems = document.querySelectorAll(".chat-item");
chatItems.forEach(item => {
    item.addEventListener("click", () => {
        const reply = prompt(`Reply to ${item.querySelector(".chat-name").innerText}:`);
        if(reply) {
            showToast(`You replied: "${reply}"`);
        }
    });
});
// ----------- LINK TO HOME SCREEN CARDS -----------
const voiceBtn = document.getElementById("voiceBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const recordBtn = document.getElementById("recordBtn");

// Voice Control
voiceBtn.addEventListener("click", startVoiceControl);

// Dark Mode
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    showToast(document.body.classList.contains("dark-mode") ? "Dark mode ON" : "Dark mode OFF");
});

// Record Note
recordBtn.addEventListener("click", async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            };

            mediaRecorder.start();
            showToast("Recording started...");
            setTimeout(() => {
                mediaRecorder.stop();
                showToast("Recording finished, playing back...");
            }, 5000); // 5 sec note
        } catch (err) {
            showToast("Microphone access denied!");
        }
    }
});
// ===================== SETTINGS: DARK MODE =====================
const darkModeToggle = document.getElementById("darkModeToggle");

if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        showToast(
            document.body.classList.contains("dark-mode")
                ? "Dark mode enabled 🌙"
                : "Dark mode disabled ☀️"
        );
    });
}
// ===================== OPEN SETTINGS =====================
const navButtons = document.querySelectorAll(".nav-btn");

if (navButtons[3]) {
    navButtons[3].addEventListener("click", () => {
        showScreen(document.getElementById("settingsScreen"));
    });
}
