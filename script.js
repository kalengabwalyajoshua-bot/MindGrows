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
