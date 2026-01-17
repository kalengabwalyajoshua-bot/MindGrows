// ===================== SCREENS SYSTEM =====================

// Get all screens
const screens = document.querySelectorAll(".screen");

/**
 * Show only one screen by ID
 * @param {string} id - screen element id
 */
function showScreen(id) {
    screens.forEach(screen => {
        screen.style.display = "none";
        screen.classList.remove("active");
    });

    const target = document.getElementById(id);
    if (!target) {
        console.error("Screen not found:", id);
        return;
    }

    target.style.display = "block";
    target.classList.add("active");
}

// Always start on Welcome Screen
document.addEventListener("DOMContentLoaded", () => {
    showScreen("welcomeScreen");
});

// ===================== BUTTONS & NAVIGATION =====================

// Get Started → Signup
const startBtn = document.getElementById("startBtn");
if (startBtn) {
    startBtn.addEventListener("click", () => {
        showScreen("signupScreen");
    });
}

// Signup → Home
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showScreen("homeScreen");
    });
}

// Home cards navigation (Subjects, Chats, Clubs, Exercises)
const subjectsBtn = document.getElementById("categoriesBtn");
if (subjectsBtn) {
    subjectsBtn.addEventListener("click", () => {
        showScreen("subjectsScreen");
    });
}

const chatBtn = document.getElementById("chatBtn");
if (chatBtn) {
    chatBtn.addEventListener("click", () => {
        showScreen("chatScreen");
    });
}

const clubsBtn = document.getElementById("clubsBtn");
if (clubsBtn) {
    clubsBtn.addEventListener("click", () => {
        showScreen("clubsScreen");
    });
}

const assignmentsBtn = document.getElementById("assignmentsBtn");
if (assignmentsBtn) {
    assignmentsBtn.addEventListener("click", () => {
        showScreen("assignmentsScreen");
    });
}

// ===================== BACK BUTTONS =====================
const backButtons = document.querySelectorAll(".back-btn");
backButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Default: go back to home
        showScreen("homeScreen");
    });
});

// ===================== MODAL HANDLING =====================
const addFriendModal = document.getElementById("addFriendModal");
const overlay = document.getElementById("overlay");

const openModalBtns = document.querySelectorAll(".open-add-friend");
openModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (addFriendModal && overlay) {
            addFriendModal.style.display = "block";
            overlay.style.display = "block";
        }
    });
});

const closeModalBtns = document.querySelectorAll(".close-modal");
closeModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (addFriendModal && overlay) {
            addFriendModal.style.display = "none";
            overlay.style.display = "none";
        }
    });
});

// ===================== TOAST MESSAGES =====================
function showToast(message, duration = 2000) {
    let toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 300);
    }, duration);
}

// ===================== DARK MODE =====================
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

// ===================== VOICE CONTROL PLACEHOLDER =====================
function handleVoiceCommand(command) {
    switch(command.toLowerCase()) {
        case "go to home":
            showScreen("homeScreen");
            break;
        case "go to chat":
            showScreen("chatScreen");
            break;
        case "go to subjects":
            showScreen("subjectsScreen");
            break;
        case "go to clubs":
            showScreen("clubsScreen");
            break;
        case "go to exercises":
            showScreen("assignmentsScreen");
            break;
        default:
            console.log("Voice command not recognized:", command);
            showToast("Command not recognized: " + command);
    }
}
