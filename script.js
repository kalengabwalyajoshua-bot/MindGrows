/* =========================
   FAST SCREEN SYSTEM
   ========================= */

const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add("active");
    }
}

/* =========================
   WELCOME → SIGNUP
   ========================= */

const startBtn = document.getElementById("startBtn");
if (startBtn) {
    startBtn.addEventListener("click", () => {
        showScreen("signupScreen");
    });
}

/* =========================
   SIGNUP → HOME
   ========================= */

const signupForm = document.getElementById("signupForm");
let userRole = "student"; // default

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const roleSelect = signupForm.querySelector("select");
        if (roleSelect) {
            userRole = roleSelect.value;
        }

        if (userRole === "teacher") {
            showScreen("teacherScreen");
        } else {
            showScreen("homeScreen");
        }
    });
}

/* =========================
   HOME CARD NAVIGATION
   ========================= */

const categoriesBtn = document.getElementById("categoriesBtn");
const chatBtn = document.getElementById("chatBtn");
const clubsBtn = document.getElementById("clubsBtn");
const assignmentsBtn = document.getElementById("assignmentsBtn");

categoriesBtn?.addEventListener("click", () => showScreen("subjectsScreen"));
chatBtn?.addEventListener("click", () => showScreen("chatScreen"));
clubsBtn?.addEventListener("click", () => showScreen("clubsScreen"));
assignmentsBtn?.addEventListener("click", () => showScreen("assignmentsScreen"));

/* =========================
   BACK BUTTONS
   ========================= */

const backButtons = document.querySelectorAll(".back-btn");
backButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (userRole === "teacher") {
            showScreen("teacherScreen");
        } else {
            showScreen("homeScreen");
        }
    });
});

/* =========================
   BOTTOM NAVIGATION
   ========================= */

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        navButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        switch (index) {
            case 0:
                showScreen("homeScreen");
                break;
            case 1:
                showScreen("subjectsScreen");
                break;
            case 2:
                showScreen("announcementsScreen");
                break;
            case 3:
                showScreen("profileScreen");
                break;
        }
    });
});

/* =========================
   CHAT → ADD FRIEND MODAL
   ========================= */

const addFriendIcon = document.querySelector("#chatScreen .material-icons");
const modal = document.getElementById("addFriendModal");
const overlay = document.getElementById("overlay");
const closeModalBtn = document.querySelector(".close-modal");

if (addFriendIcon) {
    addFriendIcon.addEventListener("click", () => {
        modal.style.display = "flex";
        overlay.style.display = "block";
    });
}

closeModalBtn?.addEventListener("click", closeModal);
overlay?.addEventListener("click", closeModal);

function closeModal() {
    modal.style.display = "none";
    overlay.style.display = "none";
}

/* =========================
   PROFILE LOGOUT
   ========================= */

const logoutBtn = document.querySelector(".profile-btn.logout");
logoutBtn?.addEventListener("click", () => {
    userRole = "student";
    showScreen("welcomeScreen");
});

/* =========================
   PERFORMANCE NOTE
   =========================
   - No innerHTML
   - No reflows
   - Only class toggles
   - Extremely fast on low-end phones
   ========================= */
/* =========================
   TEACHER TOOL BUTTONS
   ========================= */

const teacherScreen = document.getElementById("teacherScreen");
const teacherTools = teacherScreen?.querySelectorAll(".tool-card");

/*
Tool order (from HTML):
0 - Create Exercise
1 - Post Announcement
2 - Manage Classes
3 - Staff Room
4 - Manage Clubs
*/

teacherTools?.forEach((tool, index) => {
    tool.addEventListener("click", () => {
        switch (index) {
            case 0:
                openExerciseCreator();
                break;
            case 1:
                showScreen("announcementsScreen");
                break;
            case 2:
                alert("Class management coming next 👀");
                break;
            case 3:
                showScreen("staffRoomScreen");
                break;
            case 4:
                showScreen("clubsScreen");
                break;
        }
    });
});

/* =========================
   CREATE EXERCISE (FAST MOCK)
   ========================= */

function openExerciseCreator() {
    const title = prompt("Exercise title:");
    if (!title) return;

    const exerciseList = document.querySelector(".assignment-list");
    if (!exerciseList) {
        showScreen("assignmentsScreen");
    }

    setTimeout(() => {
        const card = document.createElement("div");
        card.className = "assignment-card";

        const h4 = document.createElement("h4");
        h4.textContent = title;

        const p = document.createElement("p");
        p.textContent = "Created by Teacher";

        card.appendChild(h4);
        card.appendChild(p);

        document.querySelector(".assignment-list")?.prepend(card);
        showScreen("assignmentsScreen");
    }, 100);
}

/* =========================
   POST ANNOUNCEMENT
   ========================= */

function postAnnouncement() {
    const title = prompt("Announcement title:");
    const message = prompt("Announcement message:");

    if (!title || !message) return;

    const list = document.querySelector(".announcement-list");
    if (!list) return;

    const card = document.createElement("div");
    card.className = "announcement-card";

    const h4 = document.createElement("h4");
    h4.textContent = title;

    const p = document.createElement("p");
    p.textContent = message;

    card.appendChild(h4);
    card.appendChild(p);

    list.prepend(card);
}

/* =========================
   ROLE PROTECTION
   ========================= */

function protectTeacherScreens() {
    if (userRole !== "teacher") {
        alert("Access denied 🚫 Teachers only.");
        showScreen("homeScreen");
    }
}

document.getElementById("teacherScreen")?.addEventListener("click", protectTeacherScreens);
document.getElementById("staffRoomScreen")?.addEventListener("click", protectTeacherScreens);

/* =========================
   STUDENT RESTRICTIONS
   ========================= */

function hideTeacherUI() {
    if (userRole !== "teacher") {
        document.getElementById("teacherScreen")?.remove();
    }
}

hideTeacherUI();

/* =========================
   SCHOOL-STYLE UX RULES
   =========================
   - Teachers create content
   - Students consume content
   - Staff rooms are private
   - No laggy frameworks
   ========================= */
/* =========================
   CHAT DATA (IN-MEMORY)
   ========================= */

const chats = {
    "John Doe": [
        { sender: "them", text: "Hey, did you finish the assignment?" },
        { sender: "me", text: "Almost done, you?" }
    ],
    "Study Group": [
        { sender: "them", text: "Meeting at 6 PM" }
    ]
};

let currentChat = null;

/* =========================
   OPEN CHAT
   ========================= */

const chatItems = document.querySelectorAll(".chat-item");

chatItems.forEach(item => {
    item.addEventListener("click", () => {
        const name = item.querySelector(".chat-name").textContent;
        openChat(name);
    });
});

function openChat(name) {
    currentChat = name;
    renderChatMessages(name);
    showChatView(name);
}

/* =========================
   CHAT VIEW UI (DYNAMIC)
   ========================= */

function showChatView(name) {
    let chatView = document.getElementById("chatView");

    if (!chatView) {
        chatView = document.createElement("section");
        chatView.id = "chatView";
        chatView.className = "screen active";

        chatView.innerHTML = `
            <header class="top-bar">
                <button class="back-btn material-icons">arrow_back</button>
                <h3>${name}</h3>
            </header>

            <main class="messages"></main>

            <footer class="chat-input">
                <input type="text" id="messageInput" placeholder="Type a message...">
                <button id="sendMessageBtn">Send</button>
            </footer>
        `;

        document.body.appendChild(chatView);

        chatView.querySelector(".back-btn").addEventListener("click", () => {
            chatView.classList.remove("active");
            showScreen("chatScreen");
        });

        chatView.querySelector("#sendMessageBtn").addEventListener("click", sendMessage);
    }

    showScreen("chatView");
}

/* =========================
   RENDER MESSAGES
   ========================= */

function renderChatMessages(name) {
    const messagesContainer = document.querySelector("#chatView .messages");
    if (!messagesContainer) return;

    messagesContainer.innerHTML = "";

    chats[name]?.forEach(msg => {
        const bubble = document.createElement("div");
        bubble.className = `message ${msg.sender}`;
        bubble.textContent = msg.text;
        messagesContainer.appendChild(bubble);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/* =========================
   SEND MESSAGE
   ========================= */

function sendMessage() {
    const input = document.getElementById("messageInput");
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = "";

    chats[currentChat].push({ sender: "me", text });
    renderChatMessages(currentChat);

    // fake reply (fast & optional)
    setTimeout(() => {
        chats[currentChat].push({
            sender: "them",
            text: "Okay 👍"
        });
        renderChatMessages(currentChat);
    }, 600);
}

/* =========================
   CHAT PERFORMANCE NOTES
   =========================
   - No frameworks
   - No heavy DOM updates
   - Only append/remove nodes
   - Works smoothly on low-end phones
   ========================= */
/* =========================
   AI STUDY ASSISTANT DATA
   ========================= */

const aiTips = {
    Mathematics: [
        "Practice daily, not in one long session.",
        "Understand concepts before memorizing formulas.",
        "Try explaining a solution out loud."
    ],
    Physics: [
        "Always visualize the problem.",
        "Write down knowns and unknowns first.",
        "Units can guide you to the right formula."
    ],
    Chemistry: [
        "Understand reactions, not just equations.",
        "Balance equations step by step.",
        "Practice naming compounds regularly."
    ],
    Biology: [
        "Use diagrams to remember processes.",
        "Teach the topic to someone else.",
        "Group similar concepts together."
    ]
};

/* =========================
   AI SCREEN CREATION
   ========================= */

function openAIScreen() {
    let aiScreen = document.getElementById("aiScreen");

    if (!aiScreen) {
        aiScreen = document.createElement("section");
        aiScreen.id = "aiScreen";
        aiScreen.className = "screen active";

        aiScreen.innerHTML = `
            <header class="top-bar">
                <button class="back-btn material-icons">arrow_back</button>
                <h3>AI Study Helper</h3>
            </header>

            <main class="ai-container">
                <p class="ai-text">
                    Hi 👋 I’m your MindGrow AI.<br>
                    What subject are you studying?
                </p>

                <div class="ai-subjects">
                    <button class="ai-btn">Mathematics</button>
                    <button class="ai-btn">Physics</button>
                    <button class="ai-btn">Chemistry</button>
                    <button class="ai-btn">Biology</button>
                </div>

                <div class="ai-response"></div>
            </main>
        `;

        document.body.appendChild(aiScreen);

        aiScreen.querySelector(".back-btn").addEventListener("click", () => {
            showScreen("homeScreen");
        });

        aiScreen.querySelectorAll(".ai-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                generateAITip(btn.textContent);
            });
        });
    }

    showScreen("aiScreen");
}

/* =========================
   AI RESPONSE LOGIC
   ========================= */

function generateAITip(subject) {
    const responseBox = document.querySelector(".ai-response");
    if (!responseBox) return;

    const tips = aiTips[subject];
    const tip = tips[Math.floor(Math.random() * tips.length)];

    responseBox.innerHTML = `
        <div class="ai-message">
            <strong>${subject} Tip:</strong>
            <p>${tip}</p>
        </div>
    `;
}

/* =========================
   AI ACCESS FROM HOME
   ========================= */

const aiCard = document.createElement("div");
aiCard.className = "card";
aiCard.innerHTML = `
    <span class="material-icons">psychology</span>
    <p>AI Helper</p>
`;

document.querySelector(".home-content")?.appendChild(aiCard);

aiCard.addEventListener("click", openAIScreen);

/* =========================
   AI PHILOSOPHY
   =========================
   - No cheating
   - No answers given directly
   - Focus on guidance & learning
   - Safe for schools
   ========================= */
/* =========================
   UNIVERSAL BACK BUTTON (DYNAMIC + STATIC)
   ========================= */

document.body.addEventListener("click", (e) => {
    if (!e.target.classList.contains("back-btn")) return;

    const current = document.querySelector(".screen.active");
    if (!current) return;

    // Teacher dashboard
    if (userRole === "teacher" && current.id === "teacherScreen") {
        showScreen("teacherScreen");
        return;
    }

    // Student dashboard
    if (userRole === "student" && current.id === "homeScreen") {
        showScreen("homeScreen");
        return;
    }

    // Chat screen
    if (current.id === "chatView") {
        showScreen("chatScreen");
        return;
    }

    // AI screen
    if (current.id === "aiScreen") {
        showScreen("homeScreen");
        return;
    }

    // Fallback for any other screen
    if (current.id.includes("Screen")) {
        showScreen(userRole === "teacher" ? "teacherScreen" : "homeScreen");
    }
});
