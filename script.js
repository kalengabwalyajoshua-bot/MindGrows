/* ====== MindGrow: Step 1 - User & Profile ====== */

/* Initialize App Data */
if (!localStorage.getItem('mindgrowUsers')) {
    localStorage.setItem('mindgrowUsers', JSON.stringify([]));
}

if (!localStorage.getItem('mindgrowCurrentUser')) {
    localStorage.setItem('mindgrowCurrentUser', JSON.stringify(null));
}

/* ====== DOM Elements ====== */
const welcomeScreen = document.getElementById('welcome-screen');
const signupScreen = document.getElementById('signup-screen');
const mainMenuScreen = document.getElementById('main-menu-screen');
const profileScreen = document.getElementById('profile-screen');

/* Signup Form Elements */
const signupForm = document.getElementById('signup-form');
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupSchool = document.getElementById('signup-school');
const signupRole = document.getElementById('signup-role'); // student / teacher / HOD

/* Profile Elements */
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileBio = document.getElementById('profile-bio');
const profilePic = document.getElementById('profile-pic');
const profileSaveBtn = document.getElementById('profile-save-btn');

/* ====== Helper Functions ====== */

/* Show / Hide Screens */
function showScreen(screen) {
    const screens = [welcomeScreen, signupScreen, mainMenuScreen, profileScreen];
    screens.forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

/* Load Current User */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('mindgrowCurrentUser'));
}

/* Save Current User */
function saveCurrentUser(user) {
    localStorage.setItem('mindgrowCurrentUser', JSON.stringify(user));
}

/* Load All Users */
function getAllUsers() {
    return JSON.parse(localStorage.getItem('mindgrowUsers'));
}

/* Save All Users */
function saveAllUsers(users) {
    localStorage.setItem('mindgrowUsers', JSON.stringify(users));
}

/* ====== Signup Form Submission ====== */
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const school = signupSchool.value.trim();
    const role = signupRole.value;

    if (!name || !email || !school) {
        alert("Please fill all fields.");
        return;
    }

    const users = getAllUsers();
    if (users.some(u => u.email === email)) {
        alert("Email already exists!");
        return;
    }

    const approved = role === 'student' ? true : false; // non-students need admin approval

    const newUser = {
        name,
        email,
        school,
        role,
        approved,
        bio: "",
        profilePic: "",
        points: 0,
        coins: 0,
        streak: 0
    };

    users.push(newUser);
    saveAllUsers(users);
    saveCurrentUser(newUser);

    alert(approved ? "Signup successful!" : "Signup submitted for approval.");
    showScreen(mainMenuScreen);
    loadProfile(); // load profile info
});

/* ====== Load Profile ====== */
function loadProfile() {
    const user = getCurrentUser();
    if (!user) return;

    profileName.value = user.name;
    profileEmail.value = user.email;
    profileBio.value = user.bio;
    profilePic.src = user.profilePic || 'assets/default-profile.png';
}

/* ====== Save Profile ====== */
profileSaveBtn.addEventListener('click', function() {
    const user = getCurrentUser();
    if (!user) return;

    user.name = profileName.value.trim();
    user.bio = profileBio.value.trim();
    user.profilePic = profilePic.src;

    // Update in all users
    let users = getAllUsers();
    users = users.map(u => u.email === user.email ? user : u);
    saveAllUsers(users);
    saveCurrentUser(user);

    alert("Profile updated successfully!");
});
/* ====== MindGrow Step 1 - Login & Navigation ====== */

/* DOM Elements */
const loginScreen = document.getElementById('login-screen');
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

/* ====== Show Initial Screen ====== */
window.addEventListener('load', () => {
    const user = getCurrentUser();
    if (user) {
        if (!user.approved) {
            alert("Your account is pending approval. Please wait for admin.");
            showScreen(welcomeScreen);
        } else {
            showScreen(mainMenuScreen);
            loadProfile();
        }
    } else {
        showScreen(welcomeScreen);
    }
});

/* ====== Navigation Buttons ====== */
document.getElementById('goto-signup').addEventListener('click', () => {
    showScreen(signupScreen);
});

document.getElementById('goto-login').addEventListener('click', () => {
    showScreen(loginScreen);
});

document.getElementById('goto-welcome').addEventListener('click', () => {
    showScreen(welcomeScreen);
});

/* ====== Login Form Submission ====== */
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const users = getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        alert("No account found with this email.");
        return;
    }

    if (!user.approved) {
        alert("Your account is pending approval. Please wait for admin.");
        return;
    }

    saveCurrentUser(user);
    alert(`Welcome back, ${user.name}!`);
    showScreen(mainMenuScreen);
    loadProfile();
});

/* ====== Logout Function ====== */
logoutBtn.addEventListener('click', function() {
    saveCurrentUser(null);
    alert("Logged out successfully!");
    showScreen(welcomeScreen);
});

/* ====== Role-based Access Helpers ====== */
function checkRoleAccess(requiredRoles) {
    const user = getCurrentUser();
    if (!user) return false;
    return requiredRoles.includes(user.role);
}

/* Example Usage:
if (!checkRoleAccess(['HOD','Teacher'])) {
    alert("You do not have permission!");
}
*/
/* ====== MindGrow Step 2 - Main Menu & Buttons ====== */

/* DOM Elements */
const joinClubsBtn = document.getElementById('join-clubs-btn');
const vsModeBtn = document.getElementById('vs-mode-btn');
const quizzesBtn = document.getElementById('quizzes-btn');
const pdfReaderBtn = document.getElementById('pdf-reader-btn');
const readBooksBtn = document.getElementById('read-books-btn');
const studyGroupsBtn = document.getElementById('study-groups-btn');
const announcementsBtn = document.getElementById('announcements-btn');
const competitionsBtn = document.getElementById('competitions-btn');
const dashboardBtn = document.getElementById('dashboard-btn');

/* Screens */
const clubsScreen = document.getElementById('clubs-screen');
const vsModeScreen = document.getElementById('vs-mode-screen');
const quizzesScreen = document.getElementById('quizzes-screen');
const pdfScreen = document.getElementById('pdf-screen');
const readBooksScreen = document.getElementById('read-books-screen');
const groupsScreen = document.getElementById('groups-screen');
const announcementsScreen = document.getElementById('announcements-screen');
const competitionsScreen = document.getElementById('competitions-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

/* ====== Helper to Navigate to Screen ====== */
function goToScreen(screen) {
    const allScreens = [
        mainMenuScreen,
        clubsScreen,
        vsModeScreen,
        quizzesScreen,
        pdfScreen,
        readBooksScreen,
        groupsScreen,
        announcementsScreen,
        competitionsScreen,
        dashboardScreen
    ];
    allScreens.forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

/* ====== Main Menu Button Events ====== */
joinClubsBtn.addEventListener('click', () => {
    goToScreen(clubsScreen);
    loadClubs();
});

vsModeBtn.addEventListener('click', () => {
    goToScreen(vsModeScreen);
    loadVSMode();
});

quizzesBtn.addEventListener('click', () => {
    goToScreen(quizzesScreen);
    loadQuizzes();
});

pdfReaderBtn.addEventListener('click', () => {
    goToScreen(pdfScreen);
    loadPDFReader();
});

readBooksBtn.addEventListener('click', () => {
    goToScreen(readBooksScreen);
    loadReadBooks();
});

studyGroupsBtn.addEventListener('click', () => {
    goToScreen(groupsScreen);
    loadStudyGroups();
});

announcementsBtn.addEventListener('click', () => {
    goToScreen(announcementsScreen);
    loadAnnouncements();
});

competitionsBtn.addEventListener('click', () => {
    goToScreen(competitionsScreen);
    loadCompetitions();
});

dashboardBtn.addEventListener('click', () => {
    goToScreen(dashboardScreen);
    loadDashboard();
});
/* ====== MindGrow Step 2 - Clubs & Study Groups ====== */

/* Initialize Clubs and Groups Data */
if (!localStorage.getItem('mindgrowClubs')) {
    localStorage.setItem('mindgrowClubs', JSON.stringify([]));
}

if (!localStorage.getItem('mindgrowGroups')) {
    localStorage.setItem('mindgrowGroups', JSON.stringify([]));
}

/* DOM Elements */
const clubsList = document.getElementById('clubs-list');
const createClubBtn = document.getElementById('create-club-btn');
const newClubName = document.getElementById('new-club-name');

const groupsList = document.getElementById('groups-list');
const createGroupBtn = document.getElementById('create-group-btn');
const newGroupName = document.getElementById('new-group-name');
const groupMessageInput = document.getElementById('group-message-input');
const sendGroupMessageBtn = document.getElementById('send-group-message-btn');

/* ====== Load Clubs ====== */
function loadClubs() {
    const user = getCurrentUser();
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    clubsList.innerHTML = '';

    clubs.forEach((club, idx) => {
        const clubCard = document.createElement('div');
        clubCard.classList.add('menu-card');
        clubCard.innerHTML = `
            <h3>${club.name}</h3>
            <p>Members: ${club.members.length}</p>
            <button id="join-club-${idx}">${club.members.includes(user.email) ? 'Leave' : 'Join'}</button>
        `;
        clubsList.appendChild(clubCard);

        document.getElementById(`join-club-${idx}`).addEventListener('click', () => {
            toggleClubMembership(idx);
        });
    });

    // Show create club button only for HOD / Teacher
    createClubBtn.style.display = checkRoleAccess(['HOD','Teacher']) ? 'inline-block' : 'none';
}

/* Toggle Club Membership */
function toggleClubMembership(clubIdx) {
    const user = getCurrentUser();
    let clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    const club = clubs[clubIdx];

    if (club.members.includes(user.email)) {
        club.members = club.members.filter(email => email !== user.email);
    } else {
        club.members.push(user.email);
    }

    clubs[clubIdx] = club;
    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
    loadClubs();
}

/* Create New Club */
createClubBtn.addEventListener('click', () => {
    const clubName = newClubName.value.trim();
    if (!clubName) return alert("Enter club name.");

    let clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    if (clubs.some(c => c.name === clubName)) return alert("Club already exists.");

    clubs.push({ name: clubName, members: [] });
    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
    newClubName.value = '';
    loadClubs();
});

/* ====== Load Study Groups ====== */
function loadStudyGroups() {
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groupsList.innerHTML = '';

    groups.forEach((group, idx) => {
        const groupCard = document.createElement('div');
        groupCard.classList.add('menu-card');
        let messagesHTML = group.messages.map(msg => `<p><strong>${msg.sender}:</strong> ${msg.text}</p>`).join('');
        groupCard.innerHTML = `
            <h3>${group.name}</h3>
            <div class="group-messages">${messagesHTML}</div>
        `;
        groupsList.appendChild(groupCard);
    });
}

/* Create New Study Group */
createGroupBtn.addEventListener('click', () => {
    const groupName = newGroupName.value.trim();
    if (!groupName) return alert("Enter group name.");

    let groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    if (groups.some(g => g.name === groupName)) return alert("Group already exists.");

    groups.push({ name: groupName, messages: [] });
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    newGroupName.value = '';
    loadStudyGroups();
});

/* Send Message to Study Group */
sendGroupMessageBtn.addEventListener('click', () => {
    const text = groupMessageInput.value.trim();
    if (!text) return;

    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    if (groups.length === 0) return alert("No study groups available.");

    const user = getCurrentUser();
    groups[0].messages.push({ sender: user.name, text });
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    groupMessageInput.value = '';
    loadStudyGroups();
});
/* ====== MindGrow Step 2 - Quizzes & Exercises ====== */

/* Initialize Quizzes */
if (!localStorage.getItem('mindgrowQuizzes')) {
    const sampleQuizzes = [
        {
            question: "What is 2 + 2?",
            options: ["3","4","5","6"],
            answer: "4"
        },
        {
            question: "What is the capital of France?",
            options: ["Paris","London","Berlin","Rome"],
            answer: "Paris"
        },
        {
            question: "Which element has the symbol O?",
            options: ["Oxygen","Gold","Iron","Hydrogen"],
            answer: "Oxygen"
        },
        {
            question: "Who wrote Hamlet?",
            options: ["Shakespeare","Hemingway","Dickens","Tolstoy"],
            answer: "Shakespeare"
        },
        {
            question: "What is 5 x 6?",
            options: ["30","25","20","35"],
            answer: "30"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Mars","Venus","Jupiter","Saturn"],
            answer: "Mars"
        }
    ];
    localStorage.setItem('mindgrowQuizzes', JSON.stringify(sampleQuizzes));
}

/* DOM Elements */
const quizContainer = document.getElementById('quiz-container');
const quizSubmitBtn = document.getElementById('quiz-submit-btn');

/* Load Quizzes */
function loadQuizzes() {
    const quizzes = JSON.parse(localStorage.getItem('mindgrowQuizzes') || '[]');
    quizContainer.innerHTML = '';

    quizzes.forEach((quiz, idx) => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        let optionsHTML = quiz.options.map((opt, i) => `
            <label>
                <input type="radio" name="quiz-${idx}" value="${opt}">
                ${opt}
            </label>
        `).join('');

        card.innerHTML = `
            <p><strong>${quiz.question}</strong></p>
            ${optionsHTML}
        `;
        quizContainer.appendChild(card);
    });
}

/* Submit Quiz Answers */
quizSubmitBtn.addEventListener('click', () => {
    const quizzes = JSON.parse(localStorage.getItem('mindgrowQuizzes') || '[]');
    const user = getCurrentUser();
    if (!user) return;

    let score = 0;

    quizzes.forEach((quiz, idx) => {
        const selected = document.querySelector(`input[name="quiz-${idx}"]:checked`);
        if (selected && selected.value === quiz.answer) {
            score++;
        }
    });

    if (score === 0) {
        alert("No correct answers. Try again!");
        return;
    }

    // Award points and coins
    user.points += score * 10;
    user.coins += score * 5;
    user.streak += 1;

    // Update localStorage
    let users = getAllUsers();
    users = users.map(u => u.email === user.email ? user : u);
    saveAllUsers(users);
    saveCurrentUser(user);

    alert(`You answered ${score} correctly! Points: ${user.points}, Coins: ${user.coins}, Streak: ${user.streak}`);
});
/* ====== MindGrow Step 2 - VS Mode ====== */

/* Initialize VS Challenges */
if (!localStorage.getItem('mindgrowChallenges')) {
    localStorage.setItem('mindgrowChallenges', JSON.stringify([]));
}

/* DOM Elements */
const vsOpponentEmail = document.getElementById('vs-opponent-email');
const vsStartBtn = document.getElementById('vs-start-btn');
const vsLogContainer = document.getElementById('vs-log-container');

/* Load VS Mode Logs */
function loadVSMode() {
    const challenges = JSON.parse(localStorage.getItem('mindgrowChallenges') || '[]');
    vsLogContainer.innerHTML = '';

    challenges.forEach((ch, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p><strong>${ch.challenger}</strong> vs <strong>${ch.opponent}</strong></p>
            <p>Winner: ${ch.winner}</p>
        `;
        vsLogContainer.appendChild(div);
    });
}

/* Start VS Challenge */
vsStartBtn.addEventListener('click', () => {
    const opponentEmail = vsOpponentEmail.value.trim();
    const user = getCurrentUser();
    if (!user) return;

    if (!opponentEmail) return alert("Enter opponent email.");

    const users = getAllUsers();
    const opponent = users.find(u => u.email === opponentEmail);

    if (!opponent) return alert("Opponent not found.");
    if (!opponent.approved) return alert("Opponent account pending approval.");

    // Simple random VS outcome
    const outcome = Math.random() < 0.5 ? 'challenger' : 'opponent';
    let winnerName = outcome === 'challenger' ? user.name : opponent.name;

    // Award coins
    if (outcome === 'challenger') {
        user.coins += 10;
    } else {
        opponent.coins += 10;
    }

    // Update users
    let allUsers = users.map(u => {
        if (u.email === user.email) return user;
        if (u.email === opponent.email) return opponent;
        return u;
    });
    saveAllUsers(allUsers);
    saveCurrentUser(user);

    // Save challenge log
    let challenges = JSON.parse(localStorage.getItem('mindgrowChallenges') || '[]');
    challenges.push({
        challenger: user.name,
        opponent: opponent.name,
        winner: winnerName,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('mindgrowChallenges', JSON.stringify(challenges));

    alert(`VS Challenge Complete! Winner: ${winnerName}`);
    loadVSMode();
});
/* ====== MindGrow Step 2 - PDF Reader ====== */

/* DOM Elements */
const pdfFileInput = document.getElementById('pdf-file-input');
const pdfViewer = document.getElementById('pdf-viewer');

/* Load PDF Reader Screen */
function loadPDFReader() {
    pdfViewer.src = ""; // Clear previous PDF
}

/* Handle PDF Upload */
pdfFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return alert("No file selected.");

    if (file.type !== 'application/pdf') return alert("Only PDF files are allowed.");

    const fileURL = URL.createObjectURL(file);
    pdfViewer.src = fileURL;
});
/* ====== MindGrow Step 2 - Read Books, Announcements & Competitions ====== */

/* Initialize Data */
if (!localStorage.getItem('mindgrowBooks')) {
    localStorage.setItem('mindgrowBooks', JSON.stringify([
        { title: "Mathematics 101", file: "assets/sample-math.pdf" },
        { title: "Biology Basics", file: "assets/sample-bio.pdf" },
        { title: "History of Zambia", file: "assets/sample-history.pdf" }
    ]));
}

if (!localStorage.getItem('mindgrowAnnouncements')) {
    localStorage.setItem('mindgrowAnnouncements', JSON.stringify([]));
}

if (!localStorage.getItem('mindgrowCompetitions')) {
    localStorage.setItem('mindgrowCompetitions', JSON.stringify([]));
}

/* DOM Elements */
const booksList = document.getElementById('books-list');
const announcementsList = document.getElementById('announcements-list');
const competitionsList = document.getElementById('competitions-list');

/* ====== Load Read Books ====== */
function loadReadBooks() {
    const books = JSON.parse(localStorage.getItem('mindgrowBooks') || '[]');
    booksList.innerHTML = '';

    books.forEach((book, idx) => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <h3>${book.title}</h3>
            <button id="open-book-${idx}">Open</button>
        `;
        booksList.appendChild(card);

        document.getElementById(`open-book-${idx}`).addEventListener('click', () => {
            pdfViewer.src = book.file;
            goToScreen(pdfScreen);
        });
    });
}

/* ====== Load Announcements ====== */
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || '[]');
    announcementsList.innerHTML = '';

    announcements.forEach((ann, idx) => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <h3>${ann.title}</h3>
            <p>${ann.content}</p>
            <small>Posted by: ${ann.postedBy} | ${ann.timestamp}</small>
        `;
        announcementsList.appendChild(card);
    });
}

/* Post Announcement (only HOD/Teacher) */
function postAnnouncement(title, content) {
    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Teacher'])) return alert("You cannot post announcements.");

    const announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || '[]');
    announcements.push({
        title,
        content,
        postedBy: user.name,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('mindgrowAnnouncements', JSON.stringify(announcements));
    loadAnnouncements();
}

/* ====== Load Competitions ====== */
function loadCompetitions() {
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    const user = getCurrentUser();
    competitionsList.innerHTML = '';

    competitions
        .filter(c => c.school === user.school)
        .forEach((comp, idx) => {
            const card = document.createElement('div');
            card.classList.add('menu-card');
            card.innerHTML = `
                <h3>${comp.title}</h3>
                <p>Type: ${comp.type}</p>
                <p>Participants: ${comp.participants.length}</p>
            `;
            competitionsList.appendChild(card);
        });
}

/* Create Competition (HOD/Teacher only) */
function createCompetition(title, type) {
    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Teacher'])) return alert("You cannot create competitions.");

    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    competitions.push({
        title,
        type,
        school: user.school,
        participants: []
    });
    localStorage.setItem('mindgrowCompetitions', JSON.stringify(competitions));
    loadCompetitions();
}
/* ====== MindGrow Step 2 - Dashboard, Streaks, Notifications & Top Bar ====== */

/* DOM Elements */
const dashboardPoints = document.getElementById('dashboard-points');
const dashboardCoins = document.getElementById('dashboard-coins');
const dashboardStreak = document.getElementById('dashboard-streak');
const notificationsIcon = document.getElementById('notifications-icon');
const notificationsList = document.getElementById('notifications-list');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const profileDropdownBtn = document.getElementById('profile-dropdown-btn');
const profileDropdownMenu = document.getElementById('profile-dropdown-menu');

/* ====== Load Dashboard ====== */
function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    dashboardPoints.textContent = user.points;
    dashboardCoins.textContent = user.coins;
    dashboardStreak.textContent = user.streak;
}

/* ====== Notifications ====== */
let notifications = [];

function addNotification(text) {
    notifications.push({ text, timestamp: new Date().toLocaleString() });
    updateNotifications();
}

function updateNotifications() {
    notificationsList.innerHTML = '';
    notifications.forEach((n, idx) => {
        const li = document.createElement('li');
        li.textContent = `${n.text} (${n.timestamp})`;
        notificationsList.appendChild(li);
    });
}

/* ====== Search Users ====== */
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (!query) return;

    const users = getAllUsers();
    const filtered = users.filter(u => u.name.toLowerCase().includes(query));

    filtered.forEach(u => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p>${u.name} - ${u.school} - ${u.role}</p>
            <button id="view-user-${u.email}">View Profile</button>
        `;
        searchResults.appendChild(div);

        document.getElementById(`view-user-${u.email}`).addEventListener('click', () => {
            alert(`Name: ${u.name}\nEmail: ${u.email}\nSchool: ${u.school}\nRole: ${u.role}\nBio: ${u.bio}`);
        });
    });
});

/* ====== Profile Dropdown ====== */
profileDropdownBtn.addEventListener('click', () => {
    profileDropdownMenu.classList.toggle('hidden');
});

document.getElementById('dropdown-edit-profile').addEventListener('click', () => {
    goToScreen(profileScreen);
    profileDropdownMenu.classList.add('hidden');
});

document.getElementById('dropdown-logout').addEventListener('click', () => {
    logoutBtn.click();
    profileDropdownMenu.classList.add('hidden');
});
/* ====== MindGrow Step 3 - Adaptive AI Tutor ====== */

/* Initialize AI Data */
if (!localStorage.getItem('mindgrowAI')) {
    localStorage.setItem('mindgrowAI', JSON.stringify({}));
}

/* Get AI Data for Current User */
function getAIData() {
    const user = getCurrentUser();
    if (!user) return null;

    let aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');
    if (!aiData[user.email]) {
        aiData[user.email] = {
            weakTopics: {},    // Tracks topics user struggles with
            preferredMode: null, // VS Mode, Quizzes, Reading
            suggestedBooks: [],  // Recommended PDFs
            streakHistory: []
        };
        localStorage.setItem('mindgrowAI', JSON.stringify(aiData));
    }
    return aiData[user.email];
}

/* Update AI Data for User */
function updateAIData(newData) {
    const user = getCurrentUser();
    if (!user) return;

    let aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');
    aiData[user.email] = { ...aiData[user.email], ...newData };
    localStorage.setItem('mindgrowAI', JSON.stringify(aiData));
}

/* ====== Observe User Activity ====== */

/* Track Quiz Performance */
function trackQuizPerformance(score, total, topic = "general") {
    const ai = getAIData();
    if (!ai) return;

    // Update weakTopics
    if (!ai.weakTopics[topic]) ai.weakTopics[topic] = [];
    ai.weakTopics[topic].push({ score, total, timestamp: new Date().toLocaleString() });

    updateAIData(ai);
}

/* Track VS Mode Activity */
function trackVSMode(outcome) {
    const ai = getAIData();
    if (!ai) return;

    if (!ai.preferredMode) ai.preferredMode = { mode: 'VS Mode', wins: 0, losses: 0 };
    if (outcome === 'win') ai.preferredMode.wins++;
    else ai.preferredMode.losses++;

    updateAIData(ai);
}

/* Track Reading Activity */
function trackReading(bookTitle) {
    const ai = getAIData();
    if (!ai) return;

    if (!ai.suggestedBooks.includes(bookTitle)) {
        ai.suggestedBooks.push(bookTitle);
    }

    updateAIData(ai);
}

/* Track Streaks */
function trackStreak(streakCount) {
    const ai = getAIData();
    if (!ai) return;

    ai.streakHistory.push({ streak: streakCount, date: new Date().toLocaleDateString() });
    updateAIData(ai);
}

/* ====== AI Suggestions ====== */
function getAISuggestions() {
    const ai = getAIData();
    if (!ai) return [];

    const suggestions = [];

    // Weak topics suggestion
    for (const topic in ai.weakTopics) {
        const attempts = ai.weakTopics[topic];
        const recent = attempts.slice(-3);
        const avgScore = recent.reduce((sum, a) => sum + a.score, 0) / recent.length;
        if (avgScore < recent[0].total * 0.7) {
            suggestions.push(`You may need to review: ${topic}`);
        }
    }

    // Preferred mode suggestion
    if (ai.preferredMode && ai.preferredMode.wins < ai.preferredMode.losses) {
        suggestions.push(`Practice more in ${ai.preferredMode.mode} to improve your skills.`);
    }

    // Book suggestion
    if (ai.suggestedBooks.length < 3) {
        const books = JSON.parse(localStorage.getItem('mindgrowBooks') || '[]');
        books.forEach(b => {
            if (!ai.suggestedBooks.includes(b.title)) suggestions.push(`Try reading: ${b.title}`);
        });
    }

    return suggestions;
}

/* ====== Display AI Suggestions ====== */
const aiSuggestionsContainer = document.getElementById('ai-suggestions');

function displayAISuggestions() {
    const suggestions = getAISuggestions();
    aiSuggestionsContainer.innerHTML = '';

    if (suggestions.length === 0) {
        aiSuggestionsContainer.innerHTML = "<p>No suggestions yet. Keep learning!</p>";
        return;
    }

    suggestions.forEach(s => {
        const p = document.createElement('p');
        p.textContent = `💡 ${s}`;
        aiSuggestionsContainer.appendChild(p);
    });
}
/* ====== MindGrow Step 3 - AI Auto Tracking Integration ====== */

/* ====== Integrate AI with Quizzes ====== */
quizSubmitBtn.addEventListener('click', function(e) {
    const quizzes = JSON.parse(localStorage.getItem('mindgrowQuizzes') || '[]');
    const user = getCurrentUser();
    if (!user) return;

    let score = 0;

    quizzes.forEach((quiz, idx) => {
        const selected = document.querySelector(`input[name="quiz-${idx}"]:checked`);
        if (selected && selected.value === quiz.answer) {
            score++;
        }
    });

    // Update points, coins, streak (existing)
    if (score > 0) {
        user.points += score * 10;
        user.coins += score * 5;
        user.streak += 1;

        let users = getAllUsers();
        users = users.map(u => u.email === user.email ? user : u);
        saveAllUsers(users);
        saveCurrentUser(user);
    }

    // Track AI
    trackQuizPerformance(score, quizzes.length, "general");
    trackStreak(user.streak);
    displayAISuggestions();
});
/* ====== MindGrow Step 2 - Clubs & Study Groups ====== */

/* Initialize Clubs & Study Groups */
if (!localStorage.getItem('mindgrowClubs')) {
    localStorage.setItem('mindgrowClubs', JSON.stringify([]));
}
if (!localStorage.getItem('mindgrowGroups')) {
    localStorage.setItem('mindgrowGroups', JSON.stringify([]));
}

/* DOM Elements */
const clubsList = document.getElementById('clubs-list');
const createClubBtn = document.getElementById('create-club-btn');
const groupChatContainer = document.getElementById('group-chat-container');
const groupMessageInput = document.getElementById('group-message-input');
const sendGroupMessageBtn = document.getElementById('send-group-message-btn');

/* ====== Load Clubs ====== */
function loadClubs() {
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    const user = getCurrentUser();
    clubsList.innerHTML = '';

    clubs.forEach((club, idx) => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <h3>${club.name}</h3>
            <p>Members: ${club.members.length}</p>
            <button id="join-club-${idx}">${club.members.includes(user.email) ? "Leave Club" : "Join Club"}</button>
        `;
        clubsList.appendChild(card);

        document.getElementById(`join-club-${idx}`).addEventListener('click', () => {
            if (club.members.includes(user.email)) {
                club.members = club.members.filter(m => m !== user.email);
            } else {
                club.members.push(user.email);
            }
            clubs[idx] = club;
            localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
            loadClubs();
        });
    });
}

/* ====== Create Club (HOD/Teacher only) ====== */
createClubBtn.addEventListener('click', () => {
    const clubName = prompt("Enter Club Name:");
    if (!clubName) return;

    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Teacher'])) return alert("Only HOD/Teachers can create clubs.");

    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    clubs.push({ name: clubName, createdBy: user.email, members: [] });
    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
    loadClubs();
});

/* ====== Study Groups ====== */
function loadGroups() {
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const user = getCurrentUser();
    groupChatContainer.innerHTML = '';

    groups.forEach((group, idx) => {
        if (!group.members.includes(user.email)) return;

        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `<h3>${group.name}</h3>`;

        group.messages.forEach(msg => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text} ${msg.file ? `(File: ${msg.file.name || msg.file})` : ""}`;
            div.appendChild(p);
        });

        groupChatContainer.appendChild(div);
    });
}

/* Send Group Message */
sendGroupMessageBtn.addEventListener('click', () => {
    const text = groupMessageInput.value.trim();
    if (!text) return alert("Enter a message.");

    const user = getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');

    // Send message to first group for simplicity
    const group = groups.find(g => g.members.includes(user.email));
    if (!group) return alert("You are not in any group.");

    if (!group.messages) group.messages = [];
    group.messages.push({ sender: user.name, text, timestamp: new Date().toLocaleString() });
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    groupMessageInput.value = "";
    loadGroups();
});
/* ====== MindGrow Step 2 - Posts, Likes, Comments & Approval ====== */

/* Initialize Posts */
if (!localStorage.getItem('mindgrowPosts')) {
    localStorage.setItem('mindgrowPosts', JSON.stringify([]));
}

/* DOM Elements */
const feedContainer = document.getElementById('feed-container');
const postTextInput = document.getElementById('post-text-input');
const postFileInput = document.getElementById('post-file-input');
const postBtn = document.getElementById('post-btn');

/* Load Feed */
function loadFeed() {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    feedContainer.innerHTML = '';

    // Sort by newest first
    posts.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    posts.forEach((post, idx) => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <p><strong>${post.author}</strong> (${post.role})</p>
            <p>${post.text}</p>
            ${post.file ? `<p>File: ${post.file.name || post.file}</p>` : ""}
            <p>Likes: <span id="likes-${idx}">${post.likes.length}</span> 
            <button id="like-btn-${idx}">Like</button></p>
            <div id="comments-${idx}"></div>
            <input type="text" id="comment-input-${idx}" placeholder="Comment...">
            <button id="comment-btn-${idx}">Comment</button>
        `;

        // If not approved yet, show pending
        if (!post.approved) {
            card.innerHTML += `<p style="color:red;">Pending Approval</p>`;
        }

        feedContainer.appendChild(card);

        // Like button
        document.getElementById(`like-btn-${idx}`).addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) return;

            if (!post.likes.includes(user.email)) post.likes.push(user.email);
            localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
            document.getElementById(`likes-${idx}`).textContent = post.likes.length;
        });

        // Comment button
        document.getElementById(`comment-btn-${idx}`).addEventListener('click', () => {
            const commentInput = document.getElementById(`comment-input-${idx}`);
            const commentText = commentInput.value.trim();
            if (!commentText) return;

            const user = getCurrentUser();
            if (!user) return;

            if (!post.comments) post.comments = [];
            post.comments.push({ sender: user.name, text: commentText, timestamp: new Date().toLocaleString() });
            localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
            commentInput.value = "";
            loadFeed();
        });

        // Load comments
        const commentsDiv = document.getElementById(`comments-${idx}`);
        if (post.comments) {
            post.comments.forEach(c => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${c.sender}:</strong> ${c.text}`;
                commentsDiv.appendChild(p);
            });
        }
    });
}

/* Create Post */
postBtn.addEventListener('click', () => {
    const text = postTextInput.value.trim();
    const file = postFileInput.files[0] || null;
    if (!text && !file) return alert("Write something or upload a file.");

    const user = getCurrentUser();
    if (!user) return;

    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts.push({
        author: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        text,
        file,
        likes: [],
        comments: [],
        approved: user.role === 'Student' ? true : false, // Non-students require admin approval
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    postTextInput.value = "";
    postFileInput.value = "";
    loadFeed();
});

/* Approve Posts (Admin Only) */
function approvePost(idx) {
    const user = getCurrentUser();
    if (!checkRoleAccess(['Admin','HOD'])) return alert("Only admins/HOD can approve.");

    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].approved = true;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadFeed();
}
/* ====== MindGrow Step 2 - Posts, Likes, Comments & Approval ====== */

/* Initialize Posts */
if (!localStorage.getItem('mindgrowPosts')) {
    localStorage.setItem('mindgrowPosts', JSON.stringify([]));
}

/* DOM Elements */
const feedContainer = document.getElementById('feed-container');
const postTextInput = document.getElementById('post-text-input');
const postFileInput = document.getElementById('post-file-input');
const postBtn = document.getElementById('post-btn');

/* Load Feed */
function loadFeed() {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    feedContainer.innerHTML = '';

    // Sort by newest first
    posts.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    posts.forEach((post, idx) => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <p><strong>${post.author}</strong> (${post.role})</p>
            <p>${post.text}</p>
            ${post.file ? `<p>File: ${post.file.name || post.file}</p>` : ""}
            <p>Likes: <span id="likes-${idx}">${post.likes.length}</span> 
            <button id="like-btn-${idx}">Like</button></p>
            <div id="comments-${idx}"></div>
            <input type="text" id="comment-input-${idx}" placeholder="Comment...">
            <button id="comment-btn-${idx}">Comment</button>
        `;

        // If not approved yet, show pending
        if (!post.approved) {
            card.innerHTML += `<p style="color:red;">Pending Approval</p>`;
        }

        feedContainer.appendChild(card);

        // Like button
        document.getElementById(`like-btn-${idx}`).addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) return;

            if (!post.likes.includes(user.email)) post.likes.push(user.email);
            localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
            document.getElementById(`likes-${idx}`).textContent = post.likes.length;
        });

        // Comment button
        document.getElementById(`comment-btn-${idx}`).addEventListener('click', () => {
            const commentInput = document.getElementById(`comment-input-${idx}`);
            const commentText = commentInput.value.trim();
            if (!commentText) return;

            const user = getCurrentUser();
            if (!user) return;

            if (!post.comments) post.comments = [];
            post.comments.push({ sender: user.name, text: commentText, timestamp: new Date().toLocaleString() });
            localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
            commentInput.value = "";
            loadFeed();
        });

        // Load comments
        const commentsDiv = document.getElementById(`comments-${idx}`);
        if (post.comments) {
            post.comments.forEach(c => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${c.sender}:</strong> ${c.text}`;
                commentsDiv.appendChild(p);
            });
        }
    });
}

/* Create Post */
postBtn.addEventListener('click', () => {
    const text = postTextInput.value.trim();
    const file = postFileInput.files[0] || null;
    if (!text && !file) return alert("Write something or upload a file.");

    const user = getCurrentUser();
    if (!user) return;

    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts.push({
        author: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        text,
        file,
        likes: [],
        comments: [],
        approved: user.role === 'Student' ? true : false, // Non-students require admin approval
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    postTextInput.value = "";
    postFileInput.value = "";
    loadFeed();
});

/* Approve Posts (Admin Only) */
function approvePost(idx) {
    const user = getCurrentUser();
    if (!checkRoleAccess(['Admin','HOD'])) return alert("Only admins/HOD can approve.");

    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].approved = true;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadFeed();
}
/* ====== MindGrow Step 2 - Exercises, Rewards & Leaderboard ====== */

/* Initialize Exercises */
if (!localStorage.getItem('mindgrowExercises')) {
    localStorage.setItem('mindgrowExercises', JSON.stringify([
        { question: "What is 5 + 7?", answer: "12", topic: "Math" },
        { question: "What is the capital of Zambia?", answer: "Lusaka", topic: "Geography" },
        { question: "Who discovered penicillin?", answer: "Alexander Fleming", topic: "Biology" }
    ]));
}

/* DOM Elements */
const exercisesList = document.getElementById('exercises-list');
const exerciseSubmitBtn = document.getElementById('exercise-submit-btn');
const leaderboardContainer = document.getElementById('leaderboard-container');

/* Load Exercises */
function loadExercises() {
    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    exercisesList.innerHTML = '';

    exercises.forEach((ex, idx) => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <p><strong>Question:</strong> ${ex.question}</p>
            <input type="text" id="exercise-answer-${idx}" placeholder="Your answer">
        `;
        exercisesList.appendChild(card);
    });
}

/* Submit Exercises */
exerciseSubmitBtn.addEventListener('click', () => {
    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    const user = getCurrentUser();
    if (!user) return;

    let correctCount = 0;

    exercises.forEach((ex, idx) => {
        const ans = document.getElementById(`exercise-answer-${idx}`).value.trim();
        if (ans.toLowerCase() === ex.answer.toLowerCase()) correctCount++;

        // Track AI weak topics
        trackQuizPerformance(ans.toLowerCase() === ex.answer.toLowerCase() ? 1 : 0, 1, ex.topic);
    });

    // Reward points and coins based on speed and correct answers
    user.points += correctCount * 15;  // 15 points per correct
    user.coins += correctCount * 10;   // 10 coins per correct
    user.streak += 1;

    let users = getAllUsers();
    users = users.map(u => u.email === user.email ? user : u);
    saveAllUsers(users);
    saveCurrentUser(user);

    alert(`You answered ${correctCount}/${exercises.length} correctly! Points and coins updated.`);
    loadLeaderboard();
    displayAISuggestions();
});

/* Load Leaderboard */
function loadLeaderboard() {
    const users = getAllUsers();
    leaderboardContainer.innerHTML = '';

    // Sort by points descending
    const sortedUsers = users.sort((a,b) => b.points - a.points);

    sortedUsers.forEach((u, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `<p>${idx+1}. ${u.name} - Points: ${u.points} | Coins: ${u.coins}</p>`;
        leaderboardContainer.appendChild(div);
    });
}
/* ====== MindGrow Step 2 - Notifications Integration ====== */

/* DOM Elements */
const notificationBell = document.getElementById('notifications-icon');
const notificationList = document.getElementById('notifications-list');

/* Initialize Notifications */
if (!localStorage.getItem('mindgrowNotifications')) {
    localStorage.setItem('mindgrowNotifications', JSON.stringify([]));
}

/* Add Notification */
function addNotification(text) {
    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    notifications.push({
        text,
        timestamp: new Date().toLocaleString(),
        read: false
    });
    localStorage.setItem('mindgrowNotifications', JSON.stringify(notifications));
    updateNotificationBell();
    loadNotifications();
}

/* Load Notifications */
function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    notificationList.innerHTML = '';

    notifications.slice().reverse().forEach((n, idx) => {
        const li = document.createElement('li');
        li.textContent = `${n.text} (${n.timestamp})`;
        li.style.fontWeight = n.read ? 'normal' : 'bold';
        li.addEventListener('click', () => {
            n.read = true;
            localStorage.setItem('mindgrowNotifications', JSON.stringify(notifications));
            loadNotifications();
            updateNotificationBell();
        });
        notificationList.appendChild(li);
    });
}

/* Update Bell Icon */
function updateNotificationBell() {
    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    const unreadCount = notifications.filter(n => !n.read).length;

    if (unreadCount > 0) {
        notificationBell.textContent = `🔔 (${unreadCount})`;
    } else {
        notificationBell.textContent = `🔔`;
    }
}

/* Show/Hide Notification List */
notificationBell.addEventListener('click', () => {
    notificationList.classList.toggle('hidden');
});

/* ====== Auto Notifications for Activities ====== */

/* Quiz Submission Notification */
exerciseSubmitBtn.addEventListener('click', () => {
    addNotification("You completed an exercise! Check your points and streak.");
});

/* VS Mode Notification */
vsStartBtn.addEventListener('click', () => {
    addNotification("VS Mode challenge completed!");
});

/* New Post Notification (for posts from others) */
function notifyNewPost(post) {
    const user = getCurrentUser();
    if (!user) return;
    if (post.email !== user.email && post.approved) {
        addNotification(`${post.author} posted in your school feed.`);
    }
}

/* Hook into post creation */
postBtn.addEventListener('click', () => {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    const newPost = posts[posts.length - 1];
    notifyNewPost(newPost);
});
/* ====== MindGrow Step 2 - Search Bar Functionality ====== */

/* DOM Elements */
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

/* Search Function */
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResultsContainer.innerHTML = '';

    if (!query) return;

    const users = getAllUsers();
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');

    /* Search Users */
    users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
        .forEach(u => {
            const div = document.createElement('div');
            div.classList.add('menu-card');
            div.innerHTML = `<p>👤 ${u.name} (${u.role})</p>`;
            div.addEventListener('click', () => viewProfile(u.email));
            searchResultsContainer.appendChild(div);
        });

    /* Search Posts */
    posts.filter(p => (p.text && p.text.toLowerCase().includes(query)))
        .forEach(p => {
            const div = document.createElement('div');
            div.classList.add('menu-card');
            div.innerHTML = `<p>📝 Post by ${p.author}: ${p.text}</p>`;
            searchResultsContainer.appendChild(div);
        });

    /* Search Clubs */
    clubs.filter(c => c.name.toLowerCase().includes(query))
        .forEach(c => {
            const div = document.createElement('div');
            div.classList.add('menu-card');
            div.innerHTML = `<p>🏛️ Club: ${c.name}</p>`;
            searchResultsContainer.appendChild(div);
        });

    /* Search Groups */
    groups.filter(g => g.name.toLowerCase().includes(query))
        .forEach(g => {
            const div = document.createElement('div');
            div.classList.add('menu-card');
            div.innerHTML = `<p>👥 Group: ${g.name}</p>`;
            searchResultsContainer.appendChild(div);
        });
});

/* View Profile Function */
function viewProfile(email) {
    const users = getAllUsers();
    const user = users.find(u => u.email === email);
    if (!user) return alert("User not found.");

    // Simple profile popup
    const popup = document.createElement('div');
    popup.classList.add('menu-card');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = 1000;
    popup.style.background = '#fff';
    popup.style.padding = '20px';
    popup.style.maxWidth = '300px';
    popup.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    popup.innerHTML = `
        <h3>${user.name}</h3>
        <p>Role: ${user.role}</p>
        <p>Email: ${user.email}</p>
        <p>School: ${user.school}</p>
        <p>Bio: ${user.bio || "No bio yet"}</p>
        <button id="close-popup">Close</button>
    `;

    document.body.appendChild(popup);
    document.getElementById('close-popup').addEventListener('click', () => popup.remove());
}
/* ====== MindGrow Step 2 - Announcements ====== */

/* Initialize Announcements */
if (!localStorage.getItem('mindgrowAnnouncements')) {
    localStorage.setItem('mindgrowAnnouncements', JSON.stringify([]));
}

/* DOM Elements */
const announcementContainer = document.getElementById('announcement-container');
const createAnnouncementBtn = document.getElementById('create-announcement-btn');
const announcementTextInput = document.getElementById('announcement-text-input');

/* Load Announcements */
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || '[]');
    const user = getCurrentUser();
    announcementContainer.innerHTML = '';

    // Sort by newest first
    announcements.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    announcements.forEach((ann, idx) => {
        if (ann.school && ann.school !== user.school) return; // Show school-specific only
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <p><strong>${ann.author}</strong> (${ann.role})</p>
            <p>${ann.text}</p>
            <p style="font-size:0.8em;color:#555;">${ann.timestamp}</p>
        `;
        announcementContainer.appendChild(card);
    });
}

/* Create Announcement (Teachers/HOD/Admin) */
createAnnouncementBtn.addEventListener('click', () => {
    const text = announcementTextInput.value.trim();
    if (!text) return alert("Enter announcement text.");

    const user = getCurrentUser();
    if (!checkRoleAccess(['Teacher','HOD','Admin'])) return alert("Only Teachers/HOD/Admin can post announcements.");

    const announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || '[]');
    announcements.push({
        author: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        text,
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem('mindgrowAnnouncements', JSON.stringify(announcements));
    announcementTextInput.value = "";
    loadAnnouncements();

    // Notify users in same school
    addNotification(`New announcement by ${user.name} in ${user.school}`);
});

/* Replay Announcements */
function replayAnnouncements() {
    loadAnnouncements();
}
/* ====== MindGrow Step 2 - Profile Editing & Role Approval ====== */

/* DOM Elements */
const editProfileBtn = document.getElementById('edit-profile-btn');
const profileNameInput = document.getElementById('profile-name-input');
const profileBioInput = document.getElementById('profile-bio-input');
const profilePicInput = document.getElementById('profile-pic-input');
const saveProfileBtn = document.getElementById('save-profile-btn');

/* Edit Profile */
editProfileBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    profileNameInput.value = user.name || "";
    profileBioInput.value = user.bio || "";
});

/* Save Profile */
saveProfileBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    user.name = profileNameInput.value.trim() || user.name;
    user.bio = profileBioInput.value.trim() || user.bio;

    // Handle profile picture upload (simulated with filename)
    if (profilePicInput.files[0]) {
        user.profilePic = profilePicInput.files[0].name;
    }

    // Save updated user
    let users = getAllUsers();
    users = users.map(u => u.email === user.email ? user : u);
    saveAllUsers(users);
    saveCurrentUser(user);

    alert("Profile updated successfully!");
});

/* ====== Role Approval for Non-Students ====== */
function approveUser(email) {
    const currentUser = getCurrentUser();
    if (!checkRoleAccess(['Admin','HOD'])) return alert("Only Admin/HOD can approve users.");

    const users = getAllUsers();
    const targetUser = users.find(u => u.email === email);
    if (!targetUser) return alert("User not found.");

    targetUser.approved = true;
    localStorage.setItem('mindgrowUsers', JSON.stringify(users));
    alert(`${targetUser.name} has been approved!`);
}

/* ====== Kick Unverified Users from School ====== */
function kickUnverifiedUsers() {
    const currentUser = getCurrentUser();
    if (!checkRoleAccess(['Admin','HOD'])) return alert("Only Admin/HOD can kick users.");

    let users = getAllUsers();
    const school = currentUser.school;

    users = users.filter(u => !(u.school === school && !u.approved && u.role !== 'Student'));
    localStorage.setItem('mindgrowUsers', JSON.stringify(users));
    alert("Unverified users removed from the school.");
}

/* ====== Display Profile with Approval Status ====== */
function displayUserProfile(email) {
    const users = getAllUsers();
    const user = users.find(u => u.email === email);
    if (!user) return alert("User not found.");

    let status = user.approved ? "Approved" : "Pending Approval";

    alert(`Name: ${user.name}\nRole: ${user.role}\nSchool: ${user.school}\nBio: ${user.bio || "N/A"}\nStatus: ${status}`);
}
/* ====== MindGrow Step 2 - VS Mode (Multiplayer) ====== */

/* DOM Elements */
const vsStartBtn = document.getElementById('vs-start-btn');
const vsOpponentSelect = document.getElementById('vs-opponent-select');
const vsQuestionContainer = document.getElementById('vs-question-container');
const vsAnswerInput = document.getElementById('vs-answer-input');
const vsSubmitBtn = document.getElementById('vs-submit-btn');
const vsResultContainer = document.getElementById('vs-result-container');

/* Initialize VS Mode Questions */
if (!localStorage.getItem('mindgrowVSQuestions')) {
    localStorage.setItem('mindgrowVSQuestions', JSON.stringify([
        { question: "10 x 4 = ?", answer: "40" },
        { question: "Who wrote 'Romeo and Juliet'?", answer: "Shakespeare" },
        { question: "Water freezes at how many degrees Celsius?", answer: "0" }
    ]));
}

/* Start VS Mode */
vsStartBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const users = getAllUsers().filter(u => u.email !== user.email);

    // Populate opponent select
    vsOpponentSelect.innerHTML = '';
    users.forEach(u => {
        const option = document.createElement('option');
        option.value = u.email;
        option.textContent = `${u.name} (${u.school})`;
        vsOpponentSelect.appendChild(option);
    });

    vsQuestionContainer.classList.remove('hidden');
});

/* Submit VS Answer */
vsSubmitBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const opponentEmail = vsOpponentSelect.value;
    if (!opponentEmail) return alert("Select an opponent.");

    const opponent = getAllUsers().find(u => u.email === opponentEmail);
    if (!opponent) return alert("Opponent not found.");

    const questionSet = JSON.parse(localStorage.getItem('mindgrowVSQuestions') || '[]');
    const question = questionSet[Math.floor(Math.random() * questionSet.length)];
    const answer = vsAnswerInput.value.trim();

    let userCorrect = answer.toLowerCase() === question.answer.toLowerCase();
    let opponentCorrect = Math.random() > 0.4; // Simulate opponent performance

    // Update points, coins, streaks
    if (userCorrect) {
        user.points += 20;
        user.coins += 15;
        user.streak += 1;
        trackQuizPerformance(1,1,question.topic || "VS Mode");
    } else user.streak = 0;

    if (opponentCorrect) {
        opponent.points += 20;
        opponent.coins += 15;
        opponent.streak += 1;
    } else opponent.streak = 0;

    // Save users
    let usersAll = getAllUsers().map(u => {
        if (u.email === user.email) return user;
        if (u.email === opponent.email) return opponent;
        return u;
    });
    saveAllUsers(usersAll);
    saveCurrentUser(user);

    // Show Result
    vsResultContainer.innerHTML = `
        <p>Your Answer: ${answer} ${userCorrect ? "✅ Correct" : "❌ Wrong"} </p>
        <p>${opponent.name}'s Answer: ${opponentCorrect ? "✅ Correct" : "❌ Wrong"}</p>
        <p>Points: You ${user.points} | ${opponent.name} ${opponent.points}</p>
        <p>Coins: You ${user.coins} | ${opponent.name} ${opponent.coins}</p>
    `;

    vsAnswerInput.value = "";
    displayAISuggestions();
    loadLeaderboard();
    addNotification(`VS Mode completed against ${opponent.name}.`);
});
/* ====== MindGrow Step 2 - PDF Reader ====== */

/* DOM Elements */
const pdfInput = document.getElementById('pdf-input');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfProgress = document.getElementById('pdf-progress');
const pdfOpenBtn = document.getElementById('pdf-open-btn');

/* Initialize PDF Reading Progress */
if (!localStorage.getItem('mindgrowPDFProgress')) {
    localStorage.setItem('mindgrowPDFProgress', JSON.stringify({}));
}

/* Open PDF */
pdfOpenBtn.addEventListener('click', () => {
    const file = pdfInput.files[0];
    if (!file) return alert("Select a PDF file.");

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;

        // Display PDF in iframe
        pdfViewer.innerHTML = `<iframe src="${dataUrl}" width="100%" height="500px"></iframe>`;

        // Track reading progress
        const user = getCurrentUser();
        const progress = JSON.parse(localStorage.getItem('mindgrowPDFProgress') || '{}');
        progress[user.email] = { fileName: file.name, lastOpened: new Date().toLocaleString() };
        localStorage.setItem('mindgrowPDFProgress', JSON.stringify(progress));

        addNotification(`Opened PDF: ${file.name}`);
        displayAISuggestions();
    };
    reader.readAsDataURL(file);
});

/* Show PDF Progress */
function loadPDFProgress() {
    const user = getCurrentUser();
    const progress = JSON.parse(localStorage.getItem('mindgrowPDFProgress') || '{}');

    if (progress[user.email]) {
        pdfProgress.textContent = `Last opened: ${progress[user.email].fileName} on ${progress[user.email].lastOpened}`;
    } else {
        pdfProgress.textContent = `No PDFs opened yet.`;
    }
}
/* ====== MindGrow Step 2 - AI Adaptive Learning Suggestions ====== */

/* DOM Elements */
const aiSuggestionsContainer = document.getElementById('ai-suggestions');

/* Initialize AI Tracking */
if (!localStorage.getItem('mindgrowAITracking')) {
    localStorage.setItem('mindgrowAITracking', JSON.stringify({}));
}

/* Track Quiz/Exercise Performance */
function trackQuizPerformance(correct, total, topic) {
    const user = getCurrentUser();
    if (!user) return;

    let aiData = JSON.parse(localStorage.getItem('mindgrowAITracking') || '{}');
    if (!aiData[user.email]) aiData[user.email] = {};

    if (!aiData[user.email][topic]) {
        aiData[user.email][topic] = { correct: 0, total: 0 };
    }

    aiData[user.email][topic].correct += correct;
    aiData[user.email][topic].total += total;

    localStorage.setItem('mindgrowAITracking', JSON.stringify(aiData));
}

/* Display AI Suggestions */
function displayAISuggestions() {
    const user = getCurrentUser();
    if (!user) return;

    const aiData = JSON.parse(localStorage.getItem('mindgrowAITracking') || '{}');
    aiSuggestionsContainer.innerHTML = "<h3>AI Learning Suggestions</h3>";

    if (!aiData[user.email]) {
        aiSuggestionsContainer.innerHTML += "<p>Start interacting with exercises, VS Mode, or PDFs to get suggestions!</p>";
        return;
    }

    const topics = aiData[user.email];
    for (const topic in topics) {
        const performance = topics[topic];
        const accuracy = performance.correct / performance.total;
        let suggestionText = "";

        if (accuracy < 0.5) suggestionText = `You should focus more on ${topic}.`;
        else if (accuracy < 0.8) suggestionText = `You are improving in ${topic}, keep practicing.`;
        else suggestionText = `Excellent performance in ${topic}, challenge yourself further!`;

        const p = document.createElement('p');
        p.textContent = suggestionText;
        aiSuggestionsContainer.appendChild(p);
    }
}

/* Update AI Suggestions automatically after key activities */
exerciseSubmitBtn.addEventListener('click', displayAISuggestions);
vsSubmitBtn.addEventListener('click', displayAISuggestions);
pdfOpenBtn.addEventListener('click', displayAISuggestions);
/* ====== MindGrow Step 2 - Dashboard ====== */

/* DOM Elements */
const dashboardContainer = document.getElementById('dashboard-container');

/* Load Dashboard */
function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    // Get user's clubs
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]')
        .filter(c => c.members.includes(user.email));

    // Get VS stats
    const vsStats = {
        totalChallenges: user.vsChallenges || 0,
        wins: user.vsWins || 0,
        losses: user.vsLosses || 0
    };

    // Recent Announcements
    const announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || '[]')
        .filter(a => a.school === user.school)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    dashboardContainer.innerHTML = `
        <h2>Welcome, ${user.name}</h2>
        <p>Role: ${user.role} | School: ${user.school}</p>
        <p>Points: ${user.points} | Coins: ${user.coins} | Streak: ${user.streak}</p>

        <h3>Your Clubs</h3>
        <ul>
            ${clubs.length ? clubs.map(c => `<li>${c.name}</li>`).join('') : "<li>Not part of any clubs yet.</li>"}
        </ul>

        <h3>VS Mode Stats</h3>
        <p>Total Challenges: ${vsStats.totalChallenges}</p>
        <p>Wins: ${vsStats.wins}</p>
        <p>Losses: ${vsStats.losses}</p>

        <h3>Recent Announcements</h3>
        <ul>
            ${announcements.length ? announcements.map(a => `<li><strong>${a.author}:</strong> ${a.text}</li>`).join('') : "<li>No recent announcements.</li>"}
        </ul>
    `;
}

/* Update Dashboard after key activities */
exerciseSubmitBtn.addEventListener('click', loadDashboard);
vsSubmitBtn.addEventListener('click', loadDashboard);
pdfOpenBtn.addEventListener('click', loadDashboard);
postBtn.addEventListener('click', loadDashboard);
/* ====== MindGrow Step 2 - Clubs & Study Groups ====== */

/* DOM Elements */
const createClubBtn = document.getElementById('create-club-btn');
const clubNameInput = document.getElementById('club-name-input');
const clubsContainer = document.getElementById('clubs-container');

const createGroupBtn = document.getElementById('create-group-btn');
const groupNameInput = document.getElementById('group-name-input');
const groupsContainer = document.getElementById('groups-container');

/* Initialize Clubs and Groups */
if (!localStorage.getItem('mindgrowClubs')) localStorage.setItem('mindgrowClubs', JSON.stringify([]));
if (!localStorage.getItem('mindgrowGroups')) localStorage.setItem('mindgrowGroups', JSON.stringify([]));

/* Create Club (HOD/Admin only) */
createClubBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can create clubs.");

    const name = clubNameInput.value.trim();
    if (!name) return alert("Enter a club name.");

    let clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    clubs.push({ name, school: user.school, creator: user.email, members: [user.email] });
    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));

    clubNameInput.value = "";
    loadClubs();
});

/* Load Clubs */
function loadClubs() {
    const user = getCurrentUser();
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]')
        .filter(c => c.school === user.school);

    clubsContainer.innerHTML = "";
    clubs.forEach(c => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p>🏛️ ${c.name} (Created by ${c.creator})</p>
            <button onclick="joinClub('${c.name}')">Join Club</button>
        `;
        clubsContainer.appendChild(div);
    });
}

/* Join Club */
function joinClub(clubName) {
    const user = getCurrentUser();
    let clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    const club = clubs.find(c => c.name === clubName);
    if (!club) return alert("Club not found.");
    if (club.members.includes(user.email)) return alert("Already a member.");

    club.members.push(user.email);
    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
    alert(`Joined ${clubName} successfully!`);
    loadClubs();
}

/* Create Study Group */
createGroupBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const name = groupNameInput.value.trim();
    if (!name) return alert("Enter a group name.");

    let groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups.push({ name, school: user.school, creator: user.email, members: [user.email], messages: [] });
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));

    groupNameInput.value = "";
    loadGroups();
});

/* Load Study Groups */
function loadGroups() {
    const user = getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]')
        .filter(g => g.school === user.school);

    groupsContainer.innerHTML = "";
    groups.forEach(g => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p>👥 ${g.name} (Created by ${g.creator})</p>
            <button onclick="joinGroup('${g.name}')">Join Group</button>
            <button onclick="openGroup('${g.name}')">Open Group</button>
        `;
        groupsContainer.appendChild(div);
    });
}

/* Join Group */
function joinGroup(groupName) {
    const user = getCurrentUser();
    let groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups.find(g => g.name === groupName);
    if (!group) return alert("Group not found.");
    if (group.members.includes(user.email)) return alert("Already a member.");

    group.members.push(user.email);
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    alert(`Joined ${groupName} successfully!`);
    loadGroups();
}

/* Open Group (Messaging & File Sharing) */
function openGroup(groupName) {
    const user = getCurrentUser();
    let groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups.find(g => g.name === groupName);
    if (!group) return alert("Group not found.");
    if (!group.members.includes(user.email)) return alert("You are not a member.");

    // Simple popup for messaging
    const popup = document.createElement('div');
    popup.classList.add('menu-card');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '350px';
    popup.style.maxHeight = '400px';
    popup.style.overflowY = 'auto';
    popup.style.zIndex = 1000;
    popup.style.background = '#fff';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    popup.innerHTML = `
        <h3>${group.name}</h3>
        <div id="group-messages" style="height:200px; overflow-y:auto; border:1px solid #ccc; padding:5px;"></div>
        <input type="text" id="group-msg-input" placeholder="Type a message">
        <input type="file" id="group-file-input">
        <button id="group-send-btn">Send</button>
        <button id="close-group-popup">Close</button>
    `;

    document.body.appendChild(popup);

    const groupMessagesDiv = document.getElementById('group-messages');
    const groupMsgInput = document.getElementById('group-msg-input');
    const groupFileInput = document.getElementById('group-file-input');
    const groupSendBtn = document.getElementById('group-send-btn');
    const closePopupBtn = document.getElementById('close-group-popup');

    // Load messages
    groupMessagesDiv.innerHTML = "";
    group.messages.forEach(msg => {
        const p = document.createElement('p');
        p.innerHTML = msg.type === 'file' ? `📎 ${msg.author}: ${msg.fileName}` : `<strong>${msg.author}:</strong> ${msg.text}`;
        groupMessagesDiv.appendChild(p);
    });

    // Send Message
    groupSendBtn.addEventListener('click', () => {
        const msgText = groupMsgInput.value.trim();
        if (!msgText && !groupFileInput.files[0]) return alert("Enter a message or select a file.");

        const newMsg = { author: user.name, timestamp: new Date().toLocaleString() };

        if (groupFileInput.files[0]) {
            newMsg.type = 'file';
            newMsg.fileName = groupFileInput.files[0].name;
        } else {
            newMsg.type = 'text';
            newMsg.text = msgText;
        }

        group.messages.push(newMsg);
        localStorage.setItem('mindgrowGroups', JSON.stringify(groups));

        const p = document.createElement('p');
        p.innerHTML = newMsg.type === 'file' ? `📎 ${newMsg.author}: ${newMsg.fileName}` : `<strong>${newMsg.author}:</strong> ${newMsg.text}`;
        groupMessagesDiv.appendChild(p);

        groupMsgInput.value = "";
        groupFileInput.value = "";
        groupMessagesDiv.scrollTop = groupMessagesDiv.scrollHeight;
    });

    closePopupBtn.addEventListener('click', () => popup.remove());
}
/* ====== MindGrow Step 2 - Posts, Likes, Comments, Shares ====== */

/* DOM Elements */
const postTextInput = document.getElementById('post-text-input');
const postFileInput = document.getElementById('post-file-input');
const postBtn = document.getElementById('post-btn');
const postsContainer = document.getElementById('posts-container');

/* Initialize Posts */
if (!localStorage.getItem('mindgrowPosts')) localStorage.setItem('mindgrowPosts', JSON.stringify([]));

/* Create Post */
postBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const text = postTextInput.value.trim();

    if (!text && !postFileInput.files[0]) return alert("Enter text or select a file.");

    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    const newPost = {
        author: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        text: text || "",
        fileName: postFileInput.files[0]?.name || null,
        timestamp: new Date().toLocaleString(),
        likes: [],
        comments: [],
        approved: user.role === 'Student' ? true : false // Higher-level posts require approval
    };

    posts.push(newPost);
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));

    postTextInput.value = "";
    postFileInput.value = "";

    addNotification(`New post by ${user.name}${newPost.approved ? "" : " awaiting approval"}`);
    loadPosts();
});

/* Load Posts */
function loadPosts() {
    const user = getCurrentUser();
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]')
        .filter(p => p.approved && (p.school === user.school || !p.school)); // Show school posts only

    postsContainer.innerHTML = "";

    posts.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    posts.forEach((p, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p><strong>${p.author}</strong> (${p.role}) - ${p.timestamp}</p>
            <p>${p.text}</p>
            ${p.fileName ? `<p>📎 ${p.fileName}</p>` : ""}
            <div class="post-actions">
                <button onclick="likePost(${idx})">👍 ${p.likes.length}</button>
                <button onclick="commentPost(${idx})">💬 ${p.comments.length}</button>
                <button onclick="sharePost(${idx})">🔗 Share</button>
            </div>
        `;
        postsContainer.appendChild(div);
    });
}

/* Like Post */
function likePost(postIdx) {
    const user = getCurrentUser();
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    const post = posts[postIdx];

    if (post.likes.includes(user.email)) {
        post.likes = post.likes.filter(e => e !== user.email);
    } else {
        post.likes.push(user.email);
    }

    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPosts();
}

/* Comment Post */
function commentPost(postIdx) {
    const user = getCurrentUser();
    const comment = prompt("Enter your comment:");
    if (!comment) return;

    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[postIdx].comments.push({ author: user.name, text: comment, timestamp: new Date().toLocaleString() });
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPosts();
}

/* Share Post */
function sharePost(postIdx) {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    const post = posts[postIdx];
    alert(`Post shared! Author: ${post.author}`);
}

/* Approve Posts (Admin/HOD) */
function approvePost(postIdx) {
    const currentUser = getCurrentUser();
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can approve posts.");

    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[postIdx].approved = true;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPosts();
}
/* ====== MindGrow Step 2 - Exercises & Challenges ====== */

/* DOM Elements */
const exerciseQuestionInput = document.getElementById('exercise-question-input');
const exerciseAnswerInput = document.getElementById('exercise-answer-input');
const exerciseSubmitBtn = document.getElementById('exercise-submit-btn');
const exerciseContainer = document.getElementById('exercise-container');

/* Initialize Exercises */
if (!localStorage.getItem('mindgrowExercises')) {
    localStorage.setItem('mindgrowExercises', JSON.stringify([
        { question: "2 + 2 =", answer: "4", topic: "Math", firstAnswered: null },
        { question: "Capital of France?", answer: "Paris", topic: "Geography", firstAnswered: null },
        { question: "H2O is?", answer: "Water", topic: "Chemistry", firstAnswered: null }
    ]));
}

/* Load Exercises */
function loadExercises() {
    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    exerciseContainer.innerHTML = "";

    exercises.forEach((ex, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p>${ex.question} (Topic: ${ex.topic})</p>
            <input type="text" id="exercise-answer-${idx}" placeholder="Your answer">
            <button onclick="submitExercise(${idx})">Submit</button>
        `;
        exerciseContainer.appendChild(div);
    });
}

/* Submit Exercise */
function submitExercise(exIdx) {
    const user = getCurrentUser();
    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    const ex = exercises[exIdx];
    const answerInput = document.getElementById(`exercise-answer-${exIdx}`);
    const answer = answerInput.value.trim();

    if (!answer) return alert("Enter your answer.");

    let correct = answer.toLowerCase() === ex.answer.toLowerCase();

    if (correct) {
        let pointsEarned = 10;
        let coinsEarned = 5;

        // First-to-answer bonus
        if (!ex.firstAnswered) {
            pointsEarned += 10;
            coinsEarned += 5;
            ex.firstAnswered = user.email;
            alert("First to answer! Bonus awarded.");
        }

        user.points += pointsEarned;
        user.coins += coinsEarned;
        user.streak += 1;

        trackQuizPerformance(1,1,ex.topic);
        addNotification(`Exercise solved: ${ex.question}`);
    } else {
        user.streak = 0;
    }

    // Save user and exercises
    let usersAll = getAllUsers().map(u => u.email === user.email ? user : u);
    saveAllUsers(usersAll);
    saveCurrentUser(user);

    exercises[exIdx] = ex;
    localStorage.setItem('mindgrowExercises', JSON.stringify(exercises));

    answerInput.value = "";
    displayAISuggestions();
    loadDashboard();
    loadExercises();
}

/* Add New Exercise (HOD/Admin only) */
function addExercise(question, answer, topic) {
    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can add exercises.");

    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    exercises.push({ question, answer, topic, firstAnswered: null });
    localStorage.setItem('mindgrowExercises', JSON.stringify(exercises));
    loadExercises();
}
/* ====== MindGrow Step 2 - Search Bar ====== */

/* DOM Elements */
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

/* Search Function */
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResultsContainer.innerHTML = "";

    if (!query) return;

    const users = getAllUsers().filter(u => u.name.toLowerCase().includes(query) || u.school.toLowerCase().includes(query));
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]')
        .filter(p => (p.text && p.text.toLowerCase().includes(query)) || (p.fileName && p.fileName.toLowerCase().includes(query)));
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]').filter(c => c.name.toLowerCase().includes(query));
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]').filter(g => g.name.toLowerCase().includes(query));

    if (users.length) {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `<h4>Users</h4>` + users.map(u => `<p>${u.name} (${u.school})</p>`).join('');
        searchResultsContainer.appendChild(userDiv);
    }

    if (posts.length) {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `<h4>Posts</h4>` + posts.map(p => `<p>${p.author}: ${p.text || p.fileName}</p>`).join('');
        searchResultsContainer.appendChild(postDiv);
    }

    if (clubs.length) {
        const clubDiv = document.createElement('div');
        clubDiv.innerHTML = `<h4>Clubs</h4>` + clubs.map(c => `<p>${c.name}</p>`).join('');
        searchResultsContainer.appendChild(clubDiv);
    }

    if (groups.length) {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<h4>Study Groups</h4>` + groups.map(g => `<p>${g.name}</p>`).join('');
        searchResultsContainer.appendChild(groupDiv);
    }

    if (!users.length && !posts.length && !clubs.length && !groups.length) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
    }
});
/* ====== MindGrow Step 2 - Notifications System ====== */

/* DOM Elements */
const notificationsBtn = document.getElementById('notifications-btn');
const notificationsContainer = document.getElementById('notifications-container');

/* Initialize Notifications */
if (!localStorage.getItem('mindgrowNotifications')) localStorage.setItem('mindgrowNotifications', JSON.stringify([]));

/* Add Notification */
function addNotification(text) {
    const user = getCurrentUser();
    if (!user) return;

    let notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    notifications.unshift({
        userEmail: user.email,
        text,
        timestamp: new Date().toLocaleString(),
        read: false
    });

    localStorage.setItem('mindgrowNotifications', JSON.stringify(notifications));
    displayNotifications();
}

/* Display Notifications */
function displayNotifications() {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email);

    notificationsContainer.innerHTML = "";
    if (!notifications.length) {
        notificationsContainer.innerHTML = "<p>No notifications.</p>";
        return;
    }

    notifications.forEach((n, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.style.marginBottom = "5px";
        div.innerHTML = `
            <p>${n.text}</p>
            <small>${n.timestamp}</small>
        `;
        if (!n.read) div.style.backgroundColor = "#e0f7fa"; // highlight unread
        div.addEventListener('click', () => markNotificationRead(idx));
        notificationsContainer.appendChild(div);
    });
}

/* Mark Notification as Read */
function markNotificationRead(idx) {
    const user = getCurrentUser();
    let notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email);

    if (notifications[idx]) notifications[idx].read = true;

    // Save all notifications
    let allNotifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    let updated = allNotifications.map(n => {
        if (n.userEmail === user.email && notifications.find(fn => fn.timestamp === n.timestamp)) {
            return notifications.find(fn => fn.timestamp === n.timestamp);
        }
        return n;
    });
    localStorage.setItem('mindgrowNotifications', JSON.stringify(updated));
    displayNotifications();
}

/* Update Notifications live after key activities */
postBtn.addEventListener('click', () => displayNotifications());
exerciseSubmitBtn.addEventListener('click', () => displayNotifications());
vsSubmitBtn.addEventListener('click', () => displayNotifications());
pdfOpenBtn.addEventListener('click', () => displayNotifications());
/* ====== MindGrow Step 2 - Profile Editing & Role Approval ====== */

/* DOM Elements */
const profileNameInput = document.getElementById('profile-name');
const profileBioInput = document.getElementById('profile-bio');
const profilePicInput = document.getElementById('profile-pic');
const profileSaveBtn = document.getElementById('profile-save-btn');
const profileRoleInfo = document.getElementById('profile-role-info');

/* Load Current Profile */
function loadProfile() {
    const user = getCurrentUser();
    if (!user) return;

    profileNameInput.value = user.name;
    profileBioInput.value = user.bio || "";
    profileRoleInfo.textContent = `Role: ${user.role} | ${user.role === 'Student' ? 'Auto-approved' : 'Requires approval'}`;
}

/* Save Profile */
profileSaveBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    const name = profileNameInput.value.trim();
    const bio = profileBioInput.value.trim();

    if (!name) return alert("Name cannot be empty.");

    user.name = name;
    user.bio = bio;

    if (profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.profilePic = e.target.result;
            saveUpdatedUser(user);
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        saveUpdatedUser(user);
    }
});

/* Save Updated User & Handle Role Approval */
function saveUpdatedUser(user) {
    let allUsers = getAllUsers();
    const idx = allUsers.findIndex(u => u.email === user.email);
    if (idx !== -1) allUsers[idx] = user;

    localStorage.setItem('mindgrowUsers', JSON.stringify(allUsers));
    saveCurrentUser(user);

    if (user.role !== 'Student') {
        addNotification(`Profile updated. Your role (${user.role}) requires admin approval.`);
    } else {
        addNotification(`Profile updated successfully!`);
    }

    loadProfile();
    displayAISuggestions();
}

/* Approve Higher-Level Role (Admin/HOD) */
function approveRole(userEmail) {
    const currentUser = getCurrentUser();
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can approve roles.");

    let allUsers = getAllUsers();
    const user = allUsers.find(u => u.email === userEmail);
    if (!user) return alert("User not found.");

    user.approved = true;
    localStorage.setItem('mindgrowUsers', JSON.stringify(allUsers));
    addNotification(`User ${user.name}'s role has been approved.`);
}
/* ====== MindGrow Step 2 - VS Mode ====== */

/* DOM Elements */
const vsModeContainer = document.getElementById('vs-mode-container');
const vsStartBtn = document.getElementById('vs-start-btn');
const vsQuestionDisplay = document.getElementById('vs-question-display');
const vsAnswerInput = document.getElementById('vs-answer-input');
const vsSubmitBtn = document.getElementById('vs-submit-btn');
const vsResultDisplay = document.getElementById('vs-result-display');

/* Initialize VS Challenges */
if (!localStorage.getItem('mindgrowVSChallenges')) localStorage.setItem('mindgrowVSChallenges', JSON.stringify([]));

/* Load VS Mode */
vsStartBtn.addEventListener('click', startVSChallenge);

/* Start a VS Challenge */
function startVSChallenge() {
    const user = getCurrentUser();
    const allUsers = getAllUsers().filter(u => u.school === user.school && u.email !== user.email);

    if (!allUsers.length) return alert("No opponents available in your school.");

    const opponent = allUsers[Math.floor(Math.random() * allUsers.length)];

    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    const question = exercises[Math.floor(Math.random() * exercises.length)];

    vsModeContainer.dataset.question = question.question;
    vsModeContainer.dataset.answer = question.answer;
    vsModeContainer.dataset.opponent = opponent.name;
    vsModeContainer.dataset.topic = question.topic;

    vsQuestionDisplay.textContent = `VS ${opponent.name}: ${question.question}`;
    vsAnswerInput.value = "";
    vsResultDisplay.textContent = "";
}

/* Submit VS Answer */
vsSubmitBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const question = vsModeContainer.dataset.question;
    const correctAnswer = vsModeContainer.dataset.answer;
    const topic = vsModeContainer.dataset.topic;

    const answer = vsAnswerInput.value.trim();
    if (!answer) return alert("Enter your answer.");

    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    let pointsEarned = 15;
    let coinsEarned = 10;

    if (isCorrect) {
        user.points += pointsEarned;
        user.coins += coinsEarned;
        user.streak += 1;
        vsResultDisplay.textContent = `✅ Correct! You earned ${pointsEarned} points and ${coinsEarned} coins.`;
    } else {
        user.streak = 0;
        vsResultDisplay.textContent = `❌ Incorrect. The correct answer was: ${correctAnswer}`;
    }

    // Track VS Performance in AI
    trackQuizPerformance(isCorrect ? 1 : 0, 1, topic);

    // Save User
    let usersAll = getAllUsers().map(u => u.email === user.email ? user : u);
    saveAllUsers(usersAll);
    saveCurrentUser(user);

    addNotification(`VS Mode Challenge completed against ${vsModeContainer.dataset.opponent}`);
    loadDashboard();
    displayAISuggestions();
});
/* ====== MindGrow Step 2 - PDF Reader ====== */

/* DOM Elements */
const pdfFileInput = document.getElementById('pdf-file-input');
const pdfOpenBtn = document.getElementById('pdf-open-btn');
const pdfViewer = document.getElementById('pdf-viewer');

/* Initialize PDF Storage */
if (!localStorage.getItem('mindgrowPDFs')) localStorage.setItem('mindgrowPDFs', JSON.stringify([]));

/* Open PDF */
pdfOpenBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const file = pdfFileInput.files[0];
    if (!file) return alert("Select a PDF file.");

    if (file.type !== "application/pdf") return alert("Only PDF files are supported.");

    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = e.target.result;
        pdfViewer.innerHTML = `<iframe src="${pdfData}" width="100%" height="500px"></iframe>`;

        // Save to user's PDF history
        let pdfs = JSON.parse(localStorage.getItem('mindgrowPDFs') || '[]');
        pdfs.push({ userEmail: user.email, fileName: file.name, timestamp: new Date().toLocaleString() });
        localStorage.setItem('mindgrowPDFs', JSON.stringify(pdfs));

        addNotification(`PDF "${file.name}" opened.`);
        displayAISuggestions();
        loadDashboard();
    };
    reader.readAsDataURL(file);
});
/* ====== MindGrow Step 2 - AI Suggestion Engine ====== */

/* DOM Elements */
const aiSuggestionContainer = document.getElementById('ai-suggestion-container');

/* Initialize AI Tracker */
if (!localStorage.getItem('mindgrowAI')) localStorage.setItem('mindgrowAI', JSON.stringify({}));

/* Track Quiz/Exercise/VS Performance */
function trackQuizPerformance(correct, total, topic) {
    const user = getCurrentUser();
    if (!user) return;

    let aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');
    if (!aiData[user.email]) aiData[user.email] = {};

    if (!aiData[user.email][topic]) aiData[user.email][topic] = { correct: 0, total: 0 };

    aiData[user.email][topic].correct += correct;
    aiData[user.email][topic].total += total;

    localStorage.setItem('mindgrowAI', JSON.stringify(aiData));
    displayAISuggestions();
}

/* Display AI Suggestions */
function displayAISuggestions() {
    const user = getCurrentUser();
    if (!user) return;

    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');
    const userData = aiData[user.email] || {};

    aiSuggestionContainer.innerHTML = "<h4>AI Suggestions</h4>";

    if (!Object.keys(userData).length) {
        aiSuggestionContainer.innerHTML += "<p>Start interacting with quizzes, exercises, and VS Mode to get suggestions.</p>";
        return;
    }

    Object.keys(userData).forEach(topic => {
        const data = userData[topic];
        const accuracy = ((data.correct / data.total) * 100).toFixed(1);

        let suggestion = "";
        if (accuracy < 50) suggestion = `💡 Practice more on ${topic}.`;
        else if (accuracy < 80) suggestion = `👍 You are improving in ${topic}. Keep going!`;
        else suggestion = `🏆 Excellent in ${topic}! Try advanced challenges.`;

        aiSuggestionContainer.innerHTML += `<p>${suggestion} (Accuracy: ${accuracy}%)</p>`;
    });
}
/* ====== MindGrow Step 2 - Full Dashboard Updates ====== */

/* DOM Elements */
const fullDashboardContainer = document.getElementById('full-dashboard-container');

/* Load Full Dashboard */
function loadFullDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    // User stats
    const points = user.points || 0;
    const coins = user.coins || 0;
    const streak = user.streak || 0;

    // Exercises stats
    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    const completedExercises = exercises.filter(ex => ex.firstAnswered === user.email).length;

    // VS Mode stats
    const vsStats = {
        totalChallenges: user.vsChallenges || 0,
        wins: user.vsWins || 0,
        losses: user.vsLosses || 0
    };

    // PDFs opened
    const pdfs = JSON.parse(localStorage.getItem('mindgrowPDFs') || '[]');
    const userPDFs = pdfs.filter(p => p.userEmail === user.email);

    // AI Suggestions
    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}')[user.email] || {};

    fullDashboardContainer.innerHTML = `
        <h2>Dashboard - ${user.name}</h2>
        <div class="dashboard-stats">
            <p>Points: ${points}</p>
            <p>Coins: ${coins}</p>
            <p>Streak: ${streak}</p>
            <p>Exercises Completed: ${completedExercises}</p>
            <p>VS Challenges: ${vsStats.totalChallenges} (Wins: ${vsStats.wins}, Losses: ${vsStats.losses})</p>
            <p>PDFs Opened: ${userPDFs.length}</p>
        </div>
        <div class="dashboard-ai">
            <h3>AI Suggestions</h3>
            ${Object.keys(aiData).length ? Object.keys(aiData).map(topic => {
                const accuracy = ((aiData[topic].correct / aiData[topic].total) * 100).toFixed(1);
                let suggestion = "";
                if (accuracy < 50) suggestion = `💡 Practice more on ${topic}.`;
                else if (accuracy < 80) suggestion = `👍 Improving in ${topic}, keep going.`;
                else suggestion = `🏆 Excellent in ${topic}, try advanced challenges.`;
                return `<p>${suggestion} (Accuracy: ${accuracy}%)</p>`;
            }).join('') : "<p>No activity yet. Interact with exercises, VS Mode, and PDFs to get suggestions.</p>"}
        </div>
    `;
}

/* Update Full Dashboard live */
exerciseSubmitBtn.addEventListener('click', loadFullDashboard);
vsSubmitBtn.addEventListener('click', loadFullDashboard);
pdfOpenBtn.addEventListener('click', loadFullDashboard);
postBtn.addEventListener('click', loadFullDashboard);
profileSaveBtn.addEventListener('click', loadFullDashboard);
/* ====== MindGrow Step 2 - Study Groups / Chat Groups ====== */

/* DOM Elements */
const groupNameInput = document.getElementById('group-name-input');
const groupCreateBtn = document.getElementById('group-create-btn');
const groupContainer = document.getElementById('group-container');
const groupMessageInput = document.getElementById('group-message-input');
const groupFileInput = document.getElementById('group-file-input');
const groupSendBtn = document.getElementById('group-send-btn');

/* Initialize Groups */
if (!localStorage.getItem('mindgrowGroups')) localStorage.setItem('mindgrowGroups', JSON.stringify([]));

/* Create Study Group */
groupCreateBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const name = groupNameInput.value.trim();
    if (!name) return alert("Enter group name.");

    // Only HOD/Admin can create public/school groups
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can create groups.");

    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups.push({ name, school: user.school, members: [user.email], messages: [] });
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));

    groupNameInput.value = "";
    addNotification(`Study group "${name}" created.`);
    loadGroups();
});

/* Load Study Groups */
function loadGroups() {
    const user = getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]')
        .filter(g => g.members.includes(user.email) || g.school === user.school);

    groupContainer.innerHTML = "";

    groups.forEach((g, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <h4>${g.name}</h4>
            <div id="group-messages-${idx}" class="group-messages"></div>
            <input type="text" id="group-input-${idx}" placeholder="Type a message">
            <input type="file" id="group-file-${idx}">
            <button onclick="sendGroupMessage(${idx})">Send</button>
        `;
        groupContainer.appendChild(div);
        loadGroupMessages(idx);
    });
}

/* Send Message to Group */
function sendGroupMessage(groupIdx) {
    const user = getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups[groupIdx];

    const msgInput = document.getElementById(`group-input-${groupIdx}`);
    const fileInput = document.getElementById(`group-file-${groupIdx}`);
    const text = msgInput.value.trim();

    if (!text && !fileInput.files[0]) return alert("Enter text or select a file.");

    let message = {
        author: user.name,
        email: user.email,
        text: text || "",
        file: null,
        timestamp: new Date().toLocaleString()
    };

    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            message.file = { name: fileInput.files[0].name, data: e.target.result };
            addMessageToGroup(groupIdx, message);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        addMessageToGroup(groupIdx, message);
    }
    msgInput.value = "";
    fileInput.value = "";
}

/* Add Message to Group */
function addMessageToGroup(groupIdx, message) {
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups[groupIdx].messages.push(message);
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    loadGroupMessages(groupIdx);
    addNotification(`New message in group: ${groups[groupIdx].name}`);
}

/* Load Group Messages */
function loadGroupMessages(groupIdx) {
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups[groupIdx];
    const container = document.getElementById(`group-messages-${groupIdx}`);
    container.innerHTML = "";

    group.messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('group-msg');
        msgDiv.innerHTML = `
            <p><strong>${msg.author}</strong> (${msg.timestamp})</p>
            <p>${msg.text}</p>
            ${msg.file ? `<p>📎 ${msg.file.name}</p>` : ""}
        `;
        container.appendChild(msgDiv);
    });
}
/* ====== MindGrow Step 2 - Clubs & Competitions ====== */

/* DOM Elements */
const clubNameInput = document.getElementById('club-name-input');
const clubCreateBtn = document.getElementById('club-create-btn');
const clubContainer = document.getElementById('club-container');
const competitionNameInput = document.getElementById('competition-name-input');
const competitionCreateBtn = document.getElementById('competition-create-btn');
const competitionContainer = document.getElementById('competition-container');

/* Initialize Clubs and Competitions */
if (!localStorage.getItem('mindgrowClubs')) localStorage.setItem('mindgrowClubs', JSON.stringify([]));
if (!localStorage.getItem('mindgrowCompetitions')) localStorage.setItem('mindgrowCompetitions', JSON.stringify([]));

/* Create Club (HOD/Admin only) */
clubCreateBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can create clubs.");

    const name = clubNameInput.value.trim();
    if (!name) return alert("Enter club name.");

    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    clubs.push({ name, school: user.school, members: [user.email] });
    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));

    clubNameInput.value = "";
    addNotification(`Club "${name}" created for ${user.school}.`);
    loadClubs();
});

/* Load Clubs */
function loadClubs() {
    const user = getCurrentUser();
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]')
        .filter(c => c.school === user.school);

    clubContainer.innerHTML = "";
    clubs.forEach((c, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <h4>${c.name}</h4>
            <p>Members: ${c.members.length}</p>
            <button onclick="joinClub(${idx})">Join</button>
        `;
        clubContainer.appendChild(div);
    });
}

/* Join Club */
function joinClub(idx) {
    const user = getCurrentUser();
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    if (!clubs[idx].members.includes(user.email)) {
        clubs[idx].members.push(user.email);
        localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
        addNotification(`You joined the club: ${clubs[idx].name}`);
        loadClubs();
    } else {
        alert("Already a member.");
    }
}

/* Create Competition (HOD/Admin only, school-level) */
competitionCreateBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can create competitions.");

    const name = competitionNameInput.value.trim();
    if (!name) return alert("Enter competition name.");

    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    competitions.push({ name, school: user.school, participants: [], results: [] });
    localStorage.setItem('mindgrowCompetitions', JSON.stringify(competitions));

    competitionNameInput.value = "";
    addNotification(`Competition "${name}" created for ${user.school}.`);
    loadCompetitions();
});

/* Load Competitions */
function loadCompetitions() {
    const user = getCurrentUser();
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]')
        .filter(c => c.school === user.school);

    competitionContainer.innerHTML = "";
    competitions.forEach((c, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <h4>${c.name}</h4>
            <p>Participants: ${c.participants.length}</p>
            <button onclick="joinCompetition(${idx})">Join</button>
        `;
        competitionContainer.appendChild(div);
    });
}

/* Join Competition */
function joinCompetition(idx) {
    const user = getCurrentUser();
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    if (!competitions[idx].participants.includes(user.email)) {
        competitions[idx].participants.push(user.email);
        localStorage.setItem('mindgrowCompetitions', JSON.stringify(competitions));
        addNotification(`You joined the competition: ${competitions[idx].name}`);
        loadCompetitions();
    } else {
        alert("Already joined.");
    }
}
/* ====== MindGrow Step 2 - Posts / Announcements ====== */

/* DOM Elements */
const postTextInput = document.getElementById('post-text-input');
const postFileInput = document.getElementById('post-file-input');
const postBtn = document.getElementById('post-btn');
const postContainer = document.getElementById('post-container');

/* Initialize Posts */
if (!localStorage.getItem('mindgrowPosts')) localStorage.setItem('mindgrowPosts', JSON.stringify([]));

/* Create Post */
postBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const text = postTextInput.value.trim();
    const file = postFileInput.files[0];

    if (!text && !file) return alert("Enter text or select a file.");

    const post = {
        author: user.name,
        email: user.email,
        school: user.school,
        text: text || "",
        file: null,
        likes: [],
        comments: [],
        timestamp: new Date().toLocaleString(),
        approved: user.role === 'Student' ? true : false, // only higher roles need approval
        isPublic: false
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            post.file = { name: file.name, data: e.target.result };
            savePost(post);
        };
        reader.readAsDataURL(file);
    } else {
        savePost(post);
    }

    postTextInput.value = "";
    postFileInput.value = "";
});

/* Save Post */
function savePost(post) {
    let posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts.unshift(post);
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));

    addNotification(`New post created by ${post.author}. ${post.approved ? '' : 'Pending approval.'}`);
    loadPosts();
}

/* Load Posts */
function loadPosts() {
    const user = getCurrentUser();
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]')
        .filter(p => p.approved || checkRoleAccess(['HOD','Admin'])); // show unapproved to admins

    postContainer.innerHTML = "";
    posts.forEach((p, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p><strong>${p.author}</strong> (${p.timestamp})</p>
            <p>${p.text}</p>
            ${p.file ? `<p>📎 ${p.file.name}</p>` : ""}
            <p>Likes: ${p.likes.length} | Comments: ${p.comments.length}</p>
            <button onclick="likePost(${idx})">Like</button>
            <button onclick="commentPost(${idx})">Comment</button>
            ${!p.approved && checkRoleAccess(['HOD','Admin']) ? `<button onclick="approvePost(${idx})">Approve</button>` : ""}
        `;
        postContainer.appendChild(div);
    });
}

/* Like Post */
function likePost(idx) {
    const user = getCurrentUser();
    let posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    if (!posts[idx].likes.includes(user.email)) posts[idx].likes.push(user.email);
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPosts();
}

/* Comment Post */
function commentPost(idx) {
    const comment = prompt("Enter your comment:");
    if (!comment) return;
    const user = getCurrentUser();
    let posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].comments.push({ author: user.name, email: user.email, text: comment, timestamp: new Date().toLocaleString() });
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPosts();
}

/* Approve Post */
function approvePost(idx) {
    let posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].approved = true;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    addNotification(`Post by ${posts[idx].author} approved.`);
    loadPosts();
}
/* ====== MindGrow Step 2 - Exercises / Quizzes ====== */

/* DOM Elements */
const quizQuestionDisplay = document.getElementById('quiz-question-display');
const quizAnswerInput = document.getElementById('quiz-answer-input');
const quizSubmitBtn = document.getElementById('quiz-submit-btn');
const quizResultDisplay = document.getElementById('quiz-result-display');

/* Initialize Exercises */
if (!localStorage.getItem('mindgrowExercises')) localStorage.setItem('mindgrowExercises', JSON.stringify([]));

/* Load Random Quiz */
function loadRandomQuiz() {
    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    if (!exercises.length) {
        quizQuestionDisplay.textContent = "No exercises available.";
        return;
    }

    const exercise = exercises[Math.floor(Math.random() * exercises.length)];
    quizQuestionDisplay.textContent = exercise.question;
    quizQuestionDisplay.dataset.answer = exercise.answer;
    quizQuestionDisplay.dataset.topic = exercise.topic;
    quizAnswerInput.value = "";
    quizResultDisplay.textContent = "";
}

/* Submit Quiz Answer */
quizSubmitBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const answer = quizAnswerInput.value.trim();
    const correctAnswer = quizQuestionDisplay.dataset.answer;
    const topic = quizQuestionDisplay.dataset.topic;

    if (!answer) return alert("Enter an answer.");

    let pointsEarned = 10;
    let coinsEarned = 5;

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
        user.points += pointsEarned;
        user.coins += coinsEarned;
        user.streak = (user.streak || 0) + 1;
        quizResultDisplay.textContent = `✅ Correct! You earned ${pointsEarned} points and ${coinsEarned} coins.`;
        trackQuizPerformance(1, 1, topic);
    } else {
        user.streak = 0;
        quizResultDisplay.textContent = `❌ Incorrect. The correct answer was: ${correctAnswer}`;
        trackQuizPerformance(0, 1, topic);
    }

    // Save User
    let usersAll = getAllUsers().map(u => u.email === user.email ? user : u);
    saveAllUsers(usersAll);
    saveCurrentUser(user);

    addNotification(`Exercise completed: ${topic}`);
    loadFullDashboard();
    displayAISuggestions();
});
/* ====== MindGrow Step 2 - Search Bar ====== */

/* DOM Elements */
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');

/* Search Function */
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResultsContainer.innerHTML = "";
        return;
    }

    const user = getCurrentUser();

    // Search Users
    const users = getAllUsers().filter(u => u.name.toLowerCase().includes(query) || u.school.toLowerCase().includes(query));

    // Search Posts
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]')
        .filter(p => p.text.toLowerCase().includes(query) && (p.approved || checkRoleAccess(['HOD','Admin'])));

    // Search Groups
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]')
        .filter(g => g.name.toLowerCase().includes(query) && (g.members.includes(user.email) || g.school === user.school));

    // Search Clubs
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]')
        .filter(c => c.name.toLowerCase().includes(query) && c.school === user.school);

    // Search Competitions
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]')
        .filter(c => c.name.toLowerCase().includes(query) && c.school === user.school);

    // Render Results
    let html = "";

    if (users.length) {
        html += `<h4>Users</h4>${users.map(u => `<p>${u.name} (${u.school})</p>`).join('')}`;
    }
    if (posts.length) {
        html += `<h4>Posts</h4>${posts.map(p => `<p>${p.author}: ${p.text}</p>`).join('')}`;
    }
    if (groups.length) {
        html += `<h4>Groups</h4>${groups.map(g => `<p>${g.name}</p>`).join('')}`;
    }
    if (clubs.length) {
        html += `<h4>Clubs</h4>${clubs.map(c => `<p>${c.name}</p>`).join('')}`;
    }
    if (competitions.length) {
        html += `<h4>Competitions</h4>${competitions.map(c => `<p>${c.name}</p>`).join('')}`;
    }

    searchResultsContainer.innerHTML = html || "<p>No results found.</p>";
});
/* ====== MindGrow Step 2 - Notifications ====== */

/* DOM Elements */
const notificationsContainer = document.getElementById('notifications-container');

/* Initialize Notifications */
if (!localStorage.getItem('mindgrowNotifications')) localStorage.setItem('mindgrowNotifications', JSON.stringify([]));

/* Add Notification */
function addNotification(message) {
    const user = getCurrentUser();
    if (!user) return;

    let notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');

    const newNotification = {
        userEmail: user.email,
        message: message,
        timestamp: new Date().toLocaleString(),
        read: false
    };

    notifications.unshift(newNotification); // newest on top
    localStorage.setItem('mindgrowNotifications', JSON.stringify(notifications));
    loadNotifications();
}

/* Load Notifications */
function loadNotifications() {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email);

    notificationsContainer.innerHTML = "";

    if (!notifications.length) {
        notificationsContainer.innerHTML = "<p>No notifications</p>";
        return;
    }

    notifications.forEach((n, idx) => {
        const div = document.createElement('div');
        div.classList.add('notification-card');
        div.innerHTML = `
            <p>${n.message}</p>
            <small>${n.timestamp}</small>
            <button onclick="markNotificationRead(${idx})">${n.read ? "Read" : "Mark as Read"}</button>
        `;
        notificationsContainer.appendChild(div);
    });
}

/* Mark Notification as Read */
function markNotificationRead(idx) {
    const user = getCurrentUser();
    let notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email);

    if (notifications[idx]) notifications[idx].read = true;

    let allNotifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    allNotifications = allNotifications.map(n => {
        if (n.userEmail === user.email && notifications[idx] && n.timestamp === notifications[idx].timestamp) {
            return notifications[idx];
        }
        return n;
    });

    localStorage.setItem('mindgrowNotifications', JSON.stringify(allNotifications));
    loadNotifications();
}
/* ====== MindGrow Step 2 - Profile Editing & Bio ====== */

/* DOM Elements */
const profileNameInput = document.getElementById('profile-name-input');
const profileBioInput = document.getElementById('profile-bio-input');
const profilePicInput = document.getElementById('profile-pic-input');
const profileSaveBtn = document.getElementById('profile-save-btn');
const profileContainer = document.getElementById('profile-container');

/* Load Profile */
function loadProfile() {
    const user = getCurrentUser();
    if (!user) return;

    profileNameInput.value = user.name;
    profileBioInput.value = user.bio || "";
    profileContainer.innerHTML = user.profilePic ? `<img src="${user.profilePic}" alt="Profile Pic" class="profile-pic">` : `<p>No profile picture</p>`;
}

/* Save Profile */
profileSaveBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    user.name = profileNameInput.value.trim() || user.name;
    user.bio = profileBioInput.value.trim();

    if (profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.profilePic = e.target.result;
            finalizeProfileSave(user);
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        finalizeProfileSave(user);
    }
});

/* Finalize Profile Save */
function finalizeProfileSave(user) {
    // Non-students require admin approval
    if (user.role !== 'Student') {
        user.approved = false;
        addNotification(`Profile updated by ${user.name}, pending approval.`);
    } else {
        user.approved = true;
        addNotification(`Profile updated by ${user.name}.`);
    }

    // Save user
    let allUsers = getAllUsers().map(u => u.email === user.email ? user : u);
    saveAllUsers(allUsers);
    saveCurrentUser(user);

    loadProfile();
    loadFullDashboard();
    displayAISuggestions();
}
/* ====== MindGrow Step 2 - VS Mode / Multiplayer ====== */

/* DOM Elements */
const vsStartBtn = document.getElementById('vs-start-btn');
const vsOpponentSelect = document.getElementById('vs-opponent-select');
const vsQuestionDisplay = document.getElementById('vs-question-display');
const vsAnswerInput = document.getElementById('vs-answer-input');
const vsSubmitBtn = document.getElementById('vs-submit-btn');
const vsResultDisplay = document.getElementById('vs-result-display');

/* Initialize VS Mode */
if (!localStorage.getItem('mindgrowVSChallenges')) localStorage.setItem('mindgrowVSChallenges', JSON.stringify([]));

/* Load Opponents */
function loadVSMode() {
    const user = getCurrentUser();
    const users = getAllUsers().filter(u => u.email !== user.email && u.school === user.school);

    vsOpponentSelect.innerHTML = "<option value=''>Select Opponent</option>";
    users.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.email;
        opt.textContent = u.name;
        vsOpponentSelect.appendChild(opt);
    });
}

/* Start VS Challenge */
vsStartBtn.addEventListener('click', () => {
    const opponentEmail = vsOpponentSelect.value;
    if (!opponentEmail) return alert("Select an opponent.");

    const exercises = JSON.parse(localStorage.getItem('mindgrowExercises') || '[]');
    if (!exercises.length) return alert("No exercises available for VS Mode.");

    const exercise = exercises[Math.floor(Math.random() * exercises.length)];
    vsQuestionDisplay.textContent = exercise.question;
    vsQuestionDisplay.dataset.answer = exercise.answer;
    vsQuestionDisplay.dataset.topic = exercise.topic;
    vsAnswerInput.value = "";
    vsResultDisplay.textContent = "";

    addNotification(`VS Challenge started against ${getUserByEmail(opponentEmail).name}`);
});

/* Submit VS Answer */
vsSubmitBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const answer = vsAnswerInput.value.trim();
    const correctAnswer = vsQuestionDisplay.dataset.answer;
    const topic = vsQuestionDisplay.dataset.topic;

    if (!answer) return alert("Enter your answer.");

    let pointsEarned = 15;
    let coinsEarned = 10;
    let resultMessage = "";

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
        user.points += pointsEarned;
        user.coins += coinsEarned;
        user.vsWins = (user.vsWins || 0) + 1;
        resultMessage = `✅ Correct! You won ${pointsEarned} points and ${coinsEarned} coins.`;
        trackQuizPerformance(1, 1, topic);
    } else {
        user.vsLosses = (user.vsLosses || 0) + 1;
        resultMessage = `❌ Incorrect. The correct answer was: ${correctAnswer}`;
        trackQuizPerformance(0, 1, topic);
    }

    // Save user stats
    let allUsers = getAllUsers().map(u => u.email === user.email ? user : u);
    saveAllUsers(allUsers);
    saveCurrentUser(user);

    vsResultDisplay.textContent = resultMessage;
    loadFullDashboard();
    displayAISuggestions();
});
/* ====== MindGrow Step 2 - PDF Viewer ====== */

/* DOM Elements */
const pdfInput = document.getElementById('pdf-input');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfPrevBtn = document.getElementById('pdf-prev-btn');
const pdfNextBtn = document.getElementById('pdf-next-btn');
const pdfPageDisplay = document.getElementById('pdf-page-display');

let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;

/* Load PDF */
pdfInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') return alert("Please select a PDF file.");

    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            pdfDoc = pdf;
            totalPages = pdf.numPages;
            currentPage = 1;
            renderPDFPage(currentPage);
            addNotification(`PDF loaded: ${file.name}`);
        }).catch(err => {
            alert("Failed to load PDF: " + err.message);
        });
    };
    fileReader.readAsArrayBuffer(file);
});

/* Render PDF Page */
function renderPDFPage(pageNum) {
    pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            pdfViewer.innerHTML = "";
            pdfViewer.appendChild(canvas);
            pdfPageDisplay.textContent = `Page ${currentPage} / ${totalPages}`;
        });
    });
}

/* Previous / Next Buttons */
pdfPrevBtn.addEventListener('click', () => {
    if (currentPage <= 1) return;
    currentPage--;
    renderPDFPage(currentPage);
});

pdfNextBtn.addEventListener('click', () => {
    if (currentPage >= totalPages) return;
    currentPage++;
    renderPDFPage(currentPage);
});
/* ====== MindGrow Step 2 - AI Adaptive Learning ====== */

/* Initialize AI Data */
if (!localStorage.getItem('mindgrowAI')) localStorage.setItem('mindgrowAI', JSON.stringify({}));

/* Track Quiz / Exercise Performance */
function trackQuizPerformance(correct, total, topic) {
    const user = getCurrentUser();
    if (!user) return;

    let aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');
    if (!aiData[user.email]) aiData[user.email] = {};
    if (!aiData[user.email][topic]) aiData[user.email][topic] = { correct: 0, total: 0 };

    aiData[user.email][topic].correct += correct;
    aiData[user.email][topic].total += total;

    localStorage.setItem('mindgrowAI', JSON.stringify(aiData));
    displayAISuggestions();
}

/* Track VS Performance */
function trackVSPerformance(correct, total, topic) {
    trackQuizPerformance(correct, total, topic); // same as exercises
}

/* Track PDF Reading */
function trackPDFOpened(filename) {
    const user = getCurrentUser();
    if (!user) return;

    let aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');
    if (!aiData[user.email]) aiData[user.email] = {};
    if (!aiData[user.email]['PDF Reading']) aiData[user.email]['PDF Reading'] = { correct: 0, total: 0 };

    aiData[user.email]['PDF Reading'].total += 1; // reading counts as activity
    localStorage.setItem('mindgrowAI', JSON.stringify(aiData));
    displayAISuggestions();
}

/* Display AI Suggestions */
function displayAISuggestions() {
    const user = getCurrentUser();
    if (!user) return;

    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}')[user.email] || {};
    const aiContainer = document.getElementById('ai-suggestions-container');
    if (!aiContainer) return;

    let html = "";
    Object.keys(aiData).forEach(topic => {
        const data = aiData[topic];
        const accuracy = data.total ? ((data.correct / data.total) * 100).toFixed(1) : 0;
        let suggestion = "";
        if (accuracy < 50) suggestion = `💡 Focus more on ${topic}.`;
        else if (accuracy < 80) suggestion = `👍 Improving in ${topic}, keep practicing.`;
        else suggestion = `🏆 Excellent in ${topic}, try advanced challenges.`;

        html += `<p>${suggestion} (Accuracy: ${accuracy}%)</p>`;
    });

    aiContainer.innerHTML = html || "<p>Interact with exercises, VS Mode, and PDFs to get suggestions.</p>";
}

/* Call displayAISuggestions periodically */
setInterval(displayAISuggestions, 10000); // update every 10 seconds
/* ====== MindGrow Step 2 - Study / Chat Groups ====== */

/* DOM Elements */
const groupNameInput = document.getElementById('group-name-input');
const groupCreateBtn = document.getElementById('group-create-btn');
const groupContainer = document.getElementById('group-container');
const chatMessageInput = document.getElementById('chat-message-input');
const chatFileInput = document.getElementById('chat-file-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMessagesContainer = document.getElementById('chat-messages-container');
const groupSelect = document.getElementById('group-select');

/* Initialize Groups */
if (!localStorage.getItem('mindgrowGroups')) localStorage.setItem('mindgrowGroups', JSON.stringify([]));

/* Create Group */
groupCreateBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const name = groupNameInput.value.trim();
    if (!name) return alert("Enter group name.");

    // Only HOD/Admin can create official study groups
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can create study groups.");

    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups.push({ name, school: user.school, members: [user.email], messages: [] });
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    groupNameInput.value = "";
    addNotification(`Study group "${name}" created.`);
    loadGroups();
});

/* Load Groups */
function loadGroups() {
    const user = getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]')
        .filter(g => g.members.includes(user.email) || checkRoleAccess(['HOD','Admin']));

    groupContainer.innerHTML = "";
    groupSelect.innerHTML = "<option value=''>Select Group</option>";

    groups.forEach((g, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <h4>${g.name}</h4>
            <p>Members: ${g.members.length}</p>
            <button onclick="joinGroup(${idx})">Join</button>
        `;
        groupContainer.appendChild(div);

        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = g.name;
        groupSelect.appendChild(opt);
    });
}

/* Join Group */
function joinGroup(idx) {
    const user = getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    if (!groups[idx].members.includes(user.email)) {
        groups[idx].members.push(user.email);
        localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
        addNotification(`You joined the group: ${groups[idx].name}`);
        loadGroups();
    } else {
        alert("Already a member.");
    }
}

/* Send Chat Message */
chatSendBtn.addEventListener('click', () => {
    const groupIdx = groupSelect.value;
    if (groupIdx === "") return alert("Select a group.");
    const user = getCurrentUser();
    const messageText = chatMessageInput.value.trim();

    let groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups[groupIdx];

    const message = {
        author: user.name,
        email: user.email,
        text: messageText || "",
        file: null,
        timestamp: new Date().toLocaleString()
    };

    if (chatFileInput.files[0]) {
        const file = chatFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            message.file = { name: file.name, data: e.target.result };
            finalizeChatMessage(groupIdx, message);
        };
        reader.readAsDataURL(file);
    } else {
        finalizeChatMessage(groupIdx, message);
    }
});

/* Finalize Sending Message */
function finalizeChatMessage(groupIdx, message) {
    let groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups[groupIdx].messages.push(message);
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    chatMessageInput.value = "";
    chatFileInput.value = "";
    addNotification(`New message in ${groups[groupIdx].name}`);
    loadChatMessages(groupIdx);
}

/* Load Chat Messages */
function loadChatMessages(groupIdx) {
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups[groupIdx];
    chatMessagesContainer.innerHTML = "";

    group.messages.forEach(m => {
        const div = document.createElement('div');
        div.classList.add('chat-message-card');
        div.innerHTML = `
            <p><strong>${m.author}</strong> (${m.timestamp})</p>
            <p>${m.text}</p>
            ${m.file ? `<p>📎 ${m.file.name}</p>` : ""}
        `;
        chatMessagesContainer.appendChild(div);
    });
}
/* ====== MindGrow Step 2 - Posts Approval System ====== */

/* Approve Post (Admin / HOD) already exists but extended here */
function approvePost(idx) {
    let posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    if (!posts[idx]) return;

    posts[idx].approved = true;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    addNotification(`Post by ${posts[idx].author} approved.`);

    // Update dashboard and groups/clubs/competitions if needed
    integratePostWithAllModules(posts[idx]);
    loadPosts();
}

/* Share Post to Group/Club/Competition */
function sharePost(idx, targetType, targetIdx) {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    const post = posts[idx];
    if (!post) return;

    switch(targetType) {
        case 'group':
            let groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
            if (!groups[targetIdx]) return;
            groups[targetIdx].messages.push({ ...post, shared: true, timestamp: new Date().toLocaleString() });
            localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
            addNotification(`Post shared to group: ${groups[targetIdx].name}`);
            break;
        case 'club':
            let clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
            if (!clubs[targetIdx]) return;
            clubs[targetIdx].posts = clubs[targetIdx].posts || [];
            clubs[targetIdx].posts.push({ ...post, shared: true, timestamp: new Date().toLocaleString() });
            localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
            addNotification(`Post shared to club: ${clubs[targetIdx].name}`);
            break;
        case 'competition':
            let comps = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
            if (!comps[targetIdx]) return;
            comps[targetIdx].posts = comps[targetIdx].posts || [];
            comps[targetIdx].posts.push({ ...post, shared: true, timestamp: new Date().toLocaleString() });
            localStorage.setItem('mindgrowCompetitions', JSON.stringify(comps));
            addNotification(`Post shared to competition: ${comps[targetIdx].name}`);
            break;
        default:
            alert("Invalid target for sharing.");
    }
}

/* Integrate Post With Dashboard / Modules */
function integratePostWithAllModules(post) {
    // For AI / dashboard recommendations, track post interactions
    if (post.approved) {
        trackUserActivity(post.email, 'postApproved');
    }
}

/* Like, Comment, Share Updated for Dashboard */
function likePost(idx) {
    const user = getCurrentUser();
    let posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    if (!posts[idx].likes.includes(user.email)) posts[idx].likes.push(user.email);
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPosts();
    trackUserActivity(user.email, 'likePost');
}

function commentPost(idx) {
    const comment = prompt("Enter your comment:");
    if (!comment) return;
    const user = getCurrentUser();
    let posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].comments.push({ author: user.name, email: user.email, text: comment, timestamp: new Date().toLocaleString() });
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPosts();
    trackUserActivity(user.email, 'commentPost');
}

/* Track Activity for AI / Dashboard */
function trackUserActivity(email, activityType) {
    const user = getAllUsers().find(u => u.email === email);
    if (!user) return;

    user.activityLog = user.activityLog || [];
    user.activityLog.push({ type: activityType, timestamp: new Date().toLocaleString() });

    let allUsers = getAllUsers().map(u => u.email === user.email ? user : u);
    saveAllUsers(allUsers);
}
/* ====== MindGrow Step 2 - Dashboard System ====== */

/* DOM Elements */
const dashboardPoints = document.getElementById('dashboard-points');
const dashboardCoins = document.getElementById('dashboard-coins');
const dashboardStreak = document.getElementById('dashboard-streak');
const dashboardVsWins = document.getElementById('dashboard-vs-wins');
const dashboardVsLosses = document.getElementById('dashboard-vs-losses');
const dashboardNotificationsCount = document.getElementById('dashboard-notifications-count');
const dashboardAiSuggestions = document.getElementById('dashboard-ai-suggestions');

/* Load Full Dashboard */
function loadFullDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    dashboardPoints.textContent = user.points || 0;
    dashboardCoins.textContent = user.coins || 0;
    dashboardStreak.textContent = user.streak || 0;
    dashboardVsWins.textContent = user.vsWins || 0;
    dashboardVsLosses.textContent = user.vsLosses || 0;

    // Notifications count
    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email && !n.read);
    dashboardNotificationsCount.textContent = notifications.length;

    // AI Suggestions
    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}')[user.email] || {};
    let suggestionsHtml = "";
    Object.keys(aiData).forEach(topic => {
        const data = aiData[topic];
        const accuracy = data.total ? ((data.correct / data.total) * 100).toFixed(1) : 0;
        let suggestion = "";
        if (accuracy < 50) suggestion = `💡 Focus on ${topic}.`;
        else if (accuracy < 80) suggestion = `👍 Improving in ${topic}, keep practicing.`;
        else suggestion = `🏆 Excellent in ${topic}, try advanced challenges.`;
        suggestionsHtml += `<p>${suggestion} (Accuracy: ${accuracy}%)</p>`;
    });

    dashboardAiSuggestions.innerHTML = suggestionsHtml || "<p>No activity yet. Start learning to get AI suggestions.</p>";
}

/* Auto-update Dashboard periodically */
setInterval(loadFullDashboard, 10000); // update every 10 seconds
/* ====== MindGrow Step 2 - Competitions / Challenges ====== */

/* DOM Elements */
const competitionNameInput = document.getElementById('competition-name-input');
const competitionCreateBtn = document.getElementById('competition-create-btn');
const competitionContainer = document.getElementById('competition-container');
const competitionJoinSelect = document.getElementById('competition-join-select');
const competitionJoinBtn = document.getElementById('competition-join-btn');

/* Initialize Competitions */
if (!localStorage.getItem('mindgrowCompetitions')) localStorage.setItem('mindgrowCompetitions', JSON.stringify([]));

/* Create Competition */
competitionCreateBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const name = competitionNameInput.value.trim();
    if (!name) return alert("Enter competition name.");

    // Only HOD/Admin can create school competitions
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can create competitions.");

    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    competitions.push({ 
        name, 
        school: user.school, 
        participants: [], 
        posts: [], 
        rewardsDistributed: false 
    });
    localStorage.setItem('mindgrowCompetitions', JSON.stringify(competitions));
    competitionNameInput.value = "";
    addNotification(`Competition "${name}" created.`);
    loadCompetitions();
});

/* Load Competitions */
function loadCompetitions() {
    const user = getCurrentUser();
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]')
        .filter(c => c.school === user.school);

    competitionContainer.innerHTML = "";
    competitionJoinSelect.innerHTML = "<option value=''>Select Competition</option>";

    competitions.forEach((c, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <h4>${c.name}</h4>
            <p>Participants: ${c.participants.length}</p>
            <button onclick="joinCompetition(${idx})">Join</button>
        `;
        competitionContainer.appendChild(div);

        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = c.name;
        competitionJoinSelect.appendChild(opt);
    });
}

/* Join Competition */
function joinCompetition(idx) {
    const user = getCurrentUser();
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    const comp = competitions[idx];
    if (!comp.participants.includes(user.email)) {
        comp.participants.push(user.email);
        localStorage.setItem('mindgrowCompetitions', JSON.stringify(competitions));
        addNotification(`${user.name} joined competition: ${comp.name}`);
        loadCompetitions();
    } else {
        alert("Already joined.");
    }
}

/* Distribute Rewards (example: top VS / quiz performers) */
function distributeCompetitionRewards(idx) {
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    const comp = competitions[idx];
    if (!comp || comp.rewardsDistributed) return;

    const allUsers = getAllUsers().filter(u => comp.participants.includes(u.email));

    // Simple example: Top 3 by points
    const topUsers = allUsers.sort((a,b) => (b.points || 0) - (a.points || 0)).slice(0,3);
    topUsers.forEach((u, rank) => {
        u.coins = (u.coins || 0) + (50 - rank*15); // rewards
        addNotification(`🏆 You ranked #${rank+1} in ${comp.name} and earned coins!`);
    });

    // Save updated users
    const updatedUsers = getAllUsers().map(u => topUsers.find(t => t.email === u.email) || u);
    saveAllUsers(updatedUsers);

    comp.rewardsDistributed = true;
    localStorage.setItem('mindgrowCompetitions', JSON.stringify(competitions));
}
/* ====== MindGrow Step 2 - Club System ====== */

/* DOM Elements */
const clubNameInput = document.getElementById('club-name-input');
const clubCreateBtn = document.getElementById('club-create-btn');
const clubContainer = document.getElementById('club-container');
const clubSelect = document.getElementById('club-select');
const clubAnnouncementInput = document.getElementById('club-announcement-input');
const clubAnnounceBtn = document.getElementById('club-announce-btn');
const clubPostsContainer = document.getElementById('club-posts-container');

/* Initialize Clubs */
if (!localStorage.getItem('mindgrowClubs')) localStorage.setItem('mindgrowClubs', JSON.stringify([]));

/* Create Club */
clubCreateBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const name = clubNameInput.value.trim();
    if (!name) return alert("Enter club name.");

    if (!checkRoleAccess(['HOD','Admin'])) return alert("Only HOD/Admin can create clubs.");

    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    clubs.push({ name, school: user.school, members: [user.email], posts: [] });
    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
    clubNameInput.value = "";
    addNotification(`Club "${name}" created.`);
    loadClubs();
});

/* Load Clubs */
function loadClubs() {
    const user = getCurrentUser();
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]')
        .filter(c => c.school === user.school);

    clubContainer.innerHTML = "";
    clubSelect.innerHTML = "<option value=''>Select Club</option>";

    clubs.forEach((c, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <h4>${c.name}</h4>
            <p>Members: ${c.members.length}</p>
            <button onclick="joinClub(${idx})">Join Club</button>
        `;
        clubContainer.appendChild(div);

        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = c.name;
        clubSelect.appendChild(opt);
    });
}

/* Join Club */
function joinClub(idx) {
    const user = getCurrentUser();
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    const club = clubs[idx];

    if (!club.members.includes(user.email)) {
        club.members.push(user.email);
        localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
        addNotification(`You joined the club: ${club.name}`);
        loadClubs();
    } else {
        alert("Already a member.");
    }
}

/* Post Announcement to Club */
clubAnnounceBtn.addEventListener('click', () => {
    const clubIdx = clubSelect.value;
    const message = clubAnnouncementInput.value.trim();
    if (clubIdx === "" || !message) return alert("Select club and enter message.");
    const user = getCurrentUser();

    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    const club = clubs[clubIdx];
    club.posts.push({
        author: user.name,
        email: user.email,
        text: message,
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem('mindgrowClubs', JSON.stringify(clubs));
    clubAnnouncementInput.value = "";
    addNotification(`Announcement posted in club: ${club.name}`);
    loadClubPosts(clubIdx);
});

/* Load Club Posts */
function loadClubPosts(clubIdx) {
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    const club = clubs[clubIdx];
    clubPostsContainer.innerHTML = "";

    club.posts.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('post-card');
        div.innerHTML = `
            <p><strong>${p.author}</strong> (${p.timestamp})</p>
            <p>${p.text}</p>
        `;
        clubPostsContainer.appendChild(div);
    });
}
/* ====== MindGrow Step 2 - Search / Explore Bar ====== */

/* DOM Elements */
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');

/* Live Search */
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResultsContainer.innerHTML = "";
        return;
    }

    const results = [];

    // Search Users
    const users = getAllUsers().filter(u => u.name.toLowerCase().includes(query));
    users.forEach(u => results.push({ type: 'User', name: u.name, email: u.email }));

    // Search Groups
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups.filter(g => g.name.toLowerCase().includes(query)).forEach(g => results.push({ type: 'Group', name: g.name }));

    // Search Clubs
    const clubs = JSON.parse(localStorage.getItem('mindgrowClubs') || '[]');
    clubs.filter(c => c.name.toLowerCase().includes(query)).forEach(c => results.push({ type: 'Club', name: c.name }));

    // Search Competitions
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    competitions.filter(c => c.name.toLowerCase().includes(query)).forEach(c => results.push({ type: 'Competition', name: c.name }));

    // Search Posts
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts.filter(p => p.text.toLowerCase().includes(query) && p.approved).forEach(p => results.push({ type: 'Post', name: p.text.slice(0,50) + "...", author: p.author }));

    displaySearchResults(results);
});

/* Display Search Results */
function displaySearchResults(results) {
    searchResultsContainer.innerHTML = "";
    results.forEach(r => {
        const div = document.createElement('div');
        div.classList.add('search-result-card');

        switch(r.type) {
            case 'User':
                div.innerHTML = `<p>👤 ${r.name} (${r.email})</p>`;
                break;
            case 'Group':
                div.innerHTML = `<p>👥 Group: ${r.name}</p>`;
                break;
            case 'Club':
                div.innerHTML = `<p>🏫 Club: ${r.name}</p>`;
                break;
            case 'Competition':
                div.innerHTML = `<p>🏆 Competition: ${r.name}</p>`;
                break;
            case 'Post':
                div.innerHTML = `<p>📝 Post by ${r.author}: ${r.name}</p>`;
                break;
        }

        searchResultsContainer.appendChild(div);
    });

    if (results.length === 0) searchResultsContainer.innerHTML = "<p>No results found.</p>";
}
/* ====== MindGrow Step 2 - VS Mode / Multiplayer ====== */

/* DOM Elements */
const vsModeContainer = document.getElementById('vs-mode-container');
const vsOpponentSelect = document.getElementById('vs-opponent-select');
const vsStartBtn = document.getElementById('vs-start-btn');
const vsQuestionContainer = document.getElementById('vs-question-container');
const vsAnswerButtons = document.getElementById('vs-answer-buttons');
const vsScoreDisplay = document.getElementById('vs-score-display');

/* Initialize VS Mode */
function loadVsOpponents() {
    const user = getCurrentUser();
    const users = getAllUsers().filter(u => u.email !== user.email && u.school === user.school);
    vsOpponentSelect.innerHTML = "<option value=''>Select Opponent</option>";
    users.forEach((u, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = u.name;
        vsOpponentSelect.appendChild(opt);
    });
}

/* Start VS Match */
vsStartBtn.addEventListener('click', () => {
    const opponentIdx = vsOpponentSelect.value;
    if (opponentIdx === "") return alert("Select an opponent.");
    const user = getCurrentUser();
    const opponent = getAllUsers().filter(u => u.email !== user.email && u.school === user.school)[opponentIdx];

    addNotification(`VS Match started: ${user.name} vs ${opponent.name}`);
    startVsQuiz(user, opponent);
});

/* VS Quiz Data (example) */
const vsQuestions = [
    { q: "What is 7 + 5?", a: ["11","12","13","10"], correct: "12" },
    { q: "H2O is the chemical formula of?", a: ["Water","Oxygen","Hydrogen","Helium"], correct: "Water" },
    { q: "Capital of France?", a: ["Berlin","Madrid","Paris","Rome"], correct: "Paris" },
];

/* Start VS Quiz */
function startVsQuiz(user, opponent) {
    let questionIndex = 0;
    let scores = { [user.email]: 0, [opponent.email]: 0 };

    vsQuestionContainer.innerHTML = "";
    vsAnswerButtons.innerHTML = "";
    displayVsQuestion();

    function displayVsQuestion() {
        if (questionIndex >= vsQuestions.length) return endVsMatch();
        const q = vsQuestions[questionIndex];

        vsQuestionContainer.textContent = q.q;
        vsAnswerButtons.innerHTML = "";

        q.a.forEach(answer => {
            const btn = document.createElement('button');
            btn.textContent = answer;
            btn.classList.add('vs-answer-btn');
            btn.addEventListener('click', () => {
                if (answer === q.correct) {
                    scores[user.email] += 1;
                    user.points = (user.points || 0) + 5;
                    user.coins = (user.coins || 0) + 2;
                    trackVSPerformance(1, 1, "VS Mode");
                } else {
                    scores[opponent.email] += 1; // simple simulation
                    trackVSPerformance(0, 1, "VS Mode");
                }
                questionIndex++;
                displayVsQuestion();
                vsScoreDisplay.textContent = `${user.name}: ${scores[user.email]} | ${opponent.name}: ${scores[opponent.email]}`;
                saveAllUsers([...getAllUsers().map(u => u.email === user.email ? user : u)]);
            });
            vsAnswerButtons.appendChild(btn);
        });
    }

    function endVsMatch() {
        let winner = scores[user.email] > scores[opponent.email] ? user.name : (scores[opponent.email] > scores[user.email] ? opponent.name : "Draw");
        addNotification(`VS Match ended! Winner: ${winner}`);
        vsQuestionContainer.textContent = `Match Over! Winner: ${winner}`;
        vsAnswerButtons.innerHTML = "";
    }
}
/* ====== MindGrow Step 2 - User Profile Editing System ====== */

/* DOM Elements */
const profileNameInput = document.getElementById('profile-name-input');
const profileBioInput = document.getElementById('profile-bio-input');
const profilePicInput = document.getElementById('profile-pic-input');
const profileRoleRequestSelect = document.getElementById('profile-role-request-select');
const profileSaveBtn = document.getElementById('profile-save-btn');
const profileApprovalContainer = document.getElementById('profile-approval-container');

/* Load Current Profile */
function loadUserProfile() {
    const user = getCurrentUser();
    if (!user) return;

    profileNameInput.value = user.name;
    profileBioInput.value = user.bio || "";
    if (user.profilePic) document.getElementById('profile-pic-preview').src = user.profilePic;
    profileRoleRequestSelect.value = user.roleRequest || "";
}

/* Save Profile */
profileSaveBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    user.name = profileNameInput.value.trim();
    user.bio = profileBioInput.value.trim();

    if (profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.profilePic = e.target.result;
            finalizeProfileSave(user);
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        finalizeProfileSave(user);
    }

    if (profileRoleRequestSelect.value) {
        user.roleRequest = profileRoleRequestSelect.value;
        addNotification(`Role request submitted: ${user.roleRequest}`);
    }
});

/* Finalize Profile Save */
function finalizeProfileSave(user) {
    const allUsers = getAllUsers().map(u => u.email === user.email ? user : u);
    saveAllUsers(allUsers);
    addNotification("Profile updated successfully.");
    loadUserProfile();
}

/* Admin / HOD Approve Role Requests */
function loadRoleApprovals() {
    const user = getCurrentUser();
    if (!checkRoleAccess(['HOD','Admin'])) return;

    const pendingUsers = getAllUsers().filter(u => u.roleRequest && !u.roleApproved);
    profileApprovalContainer.innerHTML = "";

    pendingUsers.forEach((u, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p>${u.name} requested role: ${u.roleRequest}</p>
            <button onclick="approveRole(${idx})">Approve</button>
            <button onclick="rejectRole(${idx})">Reject</button>
        `;
        profileApprovalContainer.appendChild(div);
    });
}

/* Approve Role */
function approveRole(idx) {
    const pendingUsers = getAllUsers().filter(u => u.roleRequest && !u.roleApproved);
    const user = pendingUsers[idx];
    user.role = user.roleRequest;
    user.roleApproved = true;
    user.roleRequest = "";
    saveAllUsers([...getAllUsers().map(u => u.email === user.email ? user : u)]);
    addNotification(`Role approved for ${user.name}`);
    loadRoleApprovals();
}

/* Reject Role */
function rejectRole(idx) {
    const pendingUsers = getAllUsers().filter(u => u.roleRequest && !u.roleApproved);
    const user = pendingUsers[idx];
    user.roleRequest = "";
    saveAllUsers([...getAllUsers().map(u => u.email === user.email ? user : u)]);
    addNotification(`Role rejected for ${user.name}`);
    loadRoleApprovals();
}
/* ====== MindGrow Step 2 - PDF / Document Viewer ====== */

/* DOM Elements */
const pdfInput = document.getElementById('pdf-input');
const pdfViewerContainer = document.getElementById('pdf-viewer-container');
const pdfFileList = document.getElementById('pdf-file-list');

/* Initialize PDF Storage */
if (!localStorage.getItem('mindgrowPDFs')) localStorage.setItem('mindgrowPDFs', JSON.stringify([]));

/* Upload PDF */
pdfInput.addEventListener('change', () => {
    const user = getCurrentUser();
    if (!user) return;
    const file = pdfInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = e.target.result;
        const allPDFs = JSON.parse(localStorage.getItem('mindgrowPDFs') || '[]');
        allPDFs.push({
            owner: user.email,
            filename: file.name,
            data: pdfData,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('mindgrowPDFs', JSON.stringify(allPDFs));
        addNotification(`PDF uploaded: ${file.name}`);
        loadUserPDFs();
    };
    reader.readAsDataURL(file);
});

/* Load User PDFs */
function loadUserPDFs() {
    const user = getCurrentUser();
    if (!user) return;

    const allPDFs = JSON.parse(localStorage.getItem('mindgrowPDFs') || '[]')
        .filter(pdf => pdf.owner === user.email);

    pdfFileList.innerHTML = "";
    allPDFs.forEach((pdf, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p>${pdf.filename} (${pdf.timestamp})</p>
            <button onclick="viewPDF(${idx})">View</button>
            <button onclick="deletePDF(${idx})">Delete</button>
        `;
        pdfFileList.appendChild(div);
    });
}

/* View PDF */
function viewPDF(idx) {
    const user = getCurrentUser();
    const allPDFs = JSON.parse(localStorage.getItem('mindgrowPDFs') || '[]').filter(pdf => pdf.owner === user.email);
    const pdf = allPDFs[idx];
    if (!pdf) return;

    pdfViewerContainer.innerHTML = `<iframe src="${pdf.data}" width="100%" height="600px"></iframe>`;
    trackPDFOpened(pdf.filename); // Track AI activity
}

/* Delete PDF */
function deletePDF(idx) {
    const user = getCurrentUser();
    let allPDFs = JSON.parse(localStorage.getItem('mindgrowPDFs') || '[]');
    const userPDFs = allPDFs.filter(pdf => pdf.owner === user.email);
    const pdfToDelete = userPDFs[idx];
    allPDFs = allPDFs.filter(pdf => pdf !== pdfToDelete);
    localStorage.setItem('mindgrowPDFs', JSON.stringify(allPDFs));
    addNotification(`PDF deleted: ${pdfToDelete.filename}`);
    loadUserPDFs();
}

/* Load PDFs on page load */
loadUserPDFs();
/* ====== MindGrow Step 2 - Exercises / Quiz System ====== */

/* DOM Elements */
const exerciseContainer = document.getElementById('exercise-container');
const exerciseQuestionContainer = document.getElementById('exercise-question-container');
const exerciseAnswerButtons = document.getElementById('exercise-answer-buttons');
const exerciseSubmitBtn = document.getElementById('exercise-submit-btn');
const exerciseFeedback = document.getElementById('exercise-feedback');
const exerciseScoreDisplay = document.getElementById('exercise-score-display');

/* Example Exercises */
const exercises = [
    { q: "What is 12 × 8?", a: ["90","96","100","86"], correct: "96", topic: "Math" },
    { q: "Symbol for Sodium?", a: ["Na","S","N","So"], correct: "Na", topic: "Chemistry" },
    { q: "Process by which plants make food?", a: ["Photosynthesis","Respiration","Transpiration","Germination"], correct: "Photosynthesis", topic: "Biology" },
];

/* Exercise State */
let exerciseIndex = 0;
let exerciseScore = 0;
let selectedAnswer = "";

/* Load Next Exercise */
function loadExercise() {
    if (exerciseIndex >= exercises.length) {
        exerciseContainer.innerHTML = `<p>Exercises completed! Total Score: ${exerciseScore}</p>`;
        trackExercisePerformance();
        return;
    }

    const ex = exercises[exerciseIndex];
    exerciseQuestionContainer.textContent = ex.q;
    exerciseAnswerButtons.innerHTML = "";
    exerciseFeedback.textContent = "";

    ex.a.forEach(ans => {
        const btn = document.createElement('button');
        btn.textContent = ans;
        btn.classList.add('exercise-btn');
        btn.addEventListener('click', () => {
            selectedAnswer = ans;
            Array.from(exerciseAnswerButtons.children).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
        exerciseAnswerButtons.appendChild(btn);
    });
}

/* Submit Answer */
exerciseSubmitBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const ex = exercises[exerciseIndex];
    if (!selectedAnswer) return alert("Select an answer.");

    if (selectedAnswer === ex.correct) {
        exerciseScore += 10;
        user.points = (user.points || 0) + 10;
        user.coins = (user.coins || 0) + 5;
        exerciseFeedback.textContent = "✅ Correct!";
    } else {
        exerciseFeedback.textContent = `❌ Incorrect! Correct answer: ${ex.correct}`;
    }

    trackExerciseAnswer(ex.topic, selectedAnswer === ex.correct);
    saveAllUsers([...getAllUsers().map(u => u.email === user.email ? user : u)]);
    exerciseScoreDisplay.textContent = `Score: ${exerciseScore}`;
    exerciseIndex++;
    setTimeout(loadExercise, 1000);
});

/* Track Exercise Performance for AI */
function trackExerciseAnswer(topic, correct) {
    const user = getCurrentUser();
    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');
    if (!aiData[user.email]) aiData[user.email] = {};
    if (!aiData[user.email][topic]) aiData[user.email][topic] = { correct: 0, total: 0 };
    aiData[user.email][topic].total += 1;
    if (correct) aiData[user.email][topic].correct += 1;

    localStorage.setItem('mindgrowAI', JSON.stringify(aiData));
}

/* Track Final Performance */
function trackExercisePerformance() {
    addNotification(`Exercises completed! Total Score: ${exerciseScore}`);
}

/* Initialize First Exercise */
loadExercise();
/* ====== MindGrow Step 2 - Notifications / Activity Feed ====== */

/* DOM Elements */
const notificationsContainer = document.getElementById('notifications-container');
const notificationsCountBadge = document.getElementById('notifications-count');

/* Initialize Notifications */
if (!localStorage.getItem('mindgrowNotifications')) localStorage.setItem('mindgrowNotifications', JSON.stringify([]));

/* Add Notification */
function addNotification(message) {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    notifications.push({
        userEmail: user.email,
        message,
        read: false,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('mindgrowNotifications', JSON.stringify(notifications));
    loadNotifications();
}

/* Load Notifications */
function loadNotifications() {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email);

    notificationsContainer.innerHTML = "";
    let unreadCount = 0;

    notifications.slice().reverse().forEach((n, idx) => {
        if (!n.read) unreadCount++;
        const div = document.createElement('div');
        div.classList.add('notification-card');
        div.innerHTML = `
            <p>${n.message}</p>
            <span>${n.timestamp}</span>
            <button onclick="markNotificationRead(${idx})">Mark Read</button>
        `;
        notificationsContainer.appendChild(div);
    });

    notificationsCountBadge.textContent = unreadCount;
}

/* Mark Notification as Read */
function markNotificationRead(idx) {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email)
        .reverse(); // reverse for display order

    notifications[idx].read = true;

    // Save back
    const allNotifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    const updatedNotifications = allNotifications.map(n => {
        if (n.userEmail === user.email && n.timestamp === notifications[idx].timestamp) return notifications[idx];
        return n;
    });
    localStorage.setItem('mindgrowNotifications', JSON.stringify(updatedNotifications));
    loadNotifications();
}

/* Auto-load Notifications every 10 seconds */
setInterval(loadNotifications, 10000);
/* ====== MindGrow Step 2 - Notifications / Activity Feed ====== */

/* DOM Elements */
const notificationsContainer = document.getElementById('notifications-container');
const notificationsCountBadge = document.getElementById('notifications-count');

/* Initialize Notifications */
if (!localStorage.getItem('mindgrowNotifications')) localStorage.setItem('mindgrowNotifications', JSON.stringify([]));

/* Add Notification */
function addNotification(message) {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    notifications.push({
        userEmail: user.email,
        message,
        read: false,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('mindgrowNotifications', JSON.stringify(notifications));
    loadNotifications();
}

/* Load Notifications */
function loadNotifications() {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email);

    notificationsContainer.innerHTML = "";
    let unreadCount = 0;

    notifications.slice().reverse().forEach((n, idx) => {
        if (!n.read) unreadCount++;
        const div = document.createElement('div');
        div.classList.add('notification-card');
        div.innerHTML = `
            <p>${n.message}</p>
            <span>${n.timestamp}</span>
            <button onclick="markNotificationRead(${idx})">Mark Read</button>
        `;
        notificationsContainer.appendChild(div);
    });

    notificationsCountBadge.textContent = unreadCount;
}

/* Mark Notification as Read */
function markNotificationRead(idx) {
    const user = getCurrentUser();
    if (!user) return;

    const notifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]')
        .filter(n => n.userEmail === user.email)
        .reverse(); // reverse for display order

    notifications[idx].read = true;

    // Save back
    const allNotifications = JSON.parse(localStorage.getItem('mindgrowNotifications') || '[]');
    const updatedNotifications = allNotifications.map(n => {
        if (n.userEmail === user.email && n.timestamp === notifications[idx].timestamp) return notifications[idx];
        return n;
    });
    localStorage.setItem('mindgrowNotifications', JSON.stringify(updatedNotifications));
    loadNotifications();
}

/* Auto-load Notifications every 10 seconds */
setInterval(loadNotifications, 10000);
/* ====== MindGrow Step 2 - Public / Class Posts Feed ====== */

/* DOM Elements */
const postTextInput = document.getElementById('post-text-input');
const postFileInput = document.getElementById('post-file-input');
const postSubmitBtn = document.getElementById('post-submit-btn');
const postsFeedContainer = document.getElementById('posts-feed-container');

/* Initialize Posts */
if (!localStorage.getItem('mindgrowPosts')) localStorage.setItem('mindgrowPosts', JSON.stringify([]));

/* Submit Post */
postSubmitBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const text = postTextInput.value.trim();
    if (!text && !postFileInput.files[0]) return alert("Enter text or upload a file.");

    const newPost = {
        author: user.name,
        email: user.email,
        text,
        file: null,
        likes: 0,
        comments: [],
        shares: 0,
        approved: checkRoleAccess(['HOD','Admin']) ? true : false,
        timestamp: new Date().toLocaleString()
    };

    if (postFileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.file = e.target.result;
            savePost(newPost);
        };
        reader.readAsDataURL(postFileInput.files[0]);
    } else {
        savePost(newPost);
    }

    postTextInput.value = "";
    postFileInput.value = "";
});

/* Save Post */
function savePost(post) {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts.push(post);
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    addNotification(`New post submitted by ${post.author}`);
    loadPostsFeed();
}

/* Load Posts Feed */
function loadPostsFeed() {
    const user = getCurrentUser();
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]')
        .filter(p => p.approved || checkRoleAccess(['HOD','Admin']));

    postsFeedContainer.innerHTML = "";
    posts.slice().reverse().forEach((p, idx) => {
        const div = document.createElement('div');
        div.classList.add('post-card');
        div.innerHTML = `
            <p><strong>${p.author}</strong> (${p.timestamp})</p>
            <p>${p.text}</p>
            ${p.file ? `<a href="${p.file}" target="_blank">📎 View File</a>` : ""}
            <p>👍 ${p.likes} ❤️ ${p.comments.length} 🔁 ${p.shares}</p>
            <button onclick="likePost(${idx})">Like</button>
            <button onclick="commentPost(${idx})">Comment</button>
            <button onclick="sharePost(${idx})">Share</button>
            ${!p.approved && checkRoleAccess(['HOD','Admin']) ? `<button onclick="approvePost(${idx})">Approve</button>` : ""}
        `;
        postsFeedContainer.appendChild(div);
    });
}

/* Like Post */
function likePost(idx) {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].likes += 1;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPostsFeed();
}

/* Comment Post */
function commentPost(idx) {
    const comment = prompt("Enter your comment:");
    if (!comment) return;
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    const user = getCurrentUser();
    posts[idx].comments.push({ text: comment, author: user.name, timestamp: new Date().toLocaleString() });
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPostsFeed();
}

/* Share Post */
function sharePost(idx) {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].shares += 1;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    loadPostsFeed();
}

/* Approve Post (Admin/HOD) */
function approvePost(idx) {
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts[idx].approved = true;
    localStorage.setItem('mindgrowPosts', JSON.stringify(posts));
    addNotification(`Post approved: ${posts[idx].author}`);
    loadPostsFeed();
}

/* Load Posts on page load */
loadPostsFeed();
/* ====== MindGrow Step 2 - Dashboard / Streaks / Coins Display ====== */

/* DOM Elements */
const dashboardStreaks = document.getElementById('dashboard-streaks');
const dashboardCoinsDisplay = document.getElementById('dashboard-coins-display');
const dashboardPointsDisplay = document.getElementById('dashboard-points-display');
const dashboardVsStats = document.getElementById('dashboard-vs-stats');
const dashboardExerciseStats = document.getElementById('dashboard-exercise-stats');
const dashboardAiTips = document.getElementById('dashboard-ai-tips');

/* Load Full Dashboard Stats */
function loadDashboardStats() {
    const user = getCurrentUser();
    if (!user) return;

    // Streaks
    const lastActive = new Date(user.lastActive || Date.now());
    const today = new Date();
    if (today.toDateString() === lastActive.toDateString()) {
        user.streak = user.streak || 1;
    } else {
        const diff = Math.floor((today - lastActive) / (1000*60*60*24));
        if (diff === 1) user.streak = (user.streak || 0) + 1;
        else user.streak = 1;
    }
    user.lastActive = today.toISOString();

    // Coins and Points
    dashboardCoinsDisplay.textContent = user.coins || 0;
    dashboardPointsDisplay.textContent = user.points || 0;

    // VS Stats
    dashboardVsStats.textContent = `VS Wins: ${user.vsWins || 0} | VS Losses: ${user.vsLosses || 0}`;

    // Exercise Stats
    dashboardExerciseStats.textContent = `Exercises Completed: ${user.exercisesCompleted || 0}`;

    // AI Suggestions / Tips
    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}')[user.email] || {};
    let tipsHtml = "";
    Object.keys(aiData).forEach(topic => {
        const data = aiData[topic];
        const accuracy = data.total ? ((data.correct / data.total) * 100).toFixed(1) : 0;
        if (accuracy < 50) tipsHtml += `<p>💡 Improve in ${topic} (Accuracy: ${accuracy}%)</p>`;
        else if (accuracy < 80) tipsHtml += `<p>👍 Good in ${topic} (Accuracy: ${accuracy}%)</p>`;
        else tipsHtml += `<p>🏆 Excellent in ${topic} (Accuracy: ${accuracy}%)</p>`;
    });
    dashboardAiTips.innerHTML = tipsHtml || "<p>No AI suggestions yet. Start learning!</p>";

    saveAllUsers([...getAllUsers().map(u => u.email === user.email ? user : u)]);
}

/* Auto-update dashboard stats every 10 seconds */
setInterval(loadDashboardStats, 10000);

/* Initialize on page load */
loadDashboardStats();
/* ====== MindGrow Step 2 - Competitions / Challenges System ====== */

/* DOM Elements */
const competitionContainer = document.getElementById('competition-container');
const competitionList = document.getElementById('competition-list');
const competitionJoinBtn = document.getElementById('competition-join-btn');
const competitionLeaderboard = document.getElementById('competition-leaderboard');

/* Initialize Competitions */
if (!localStorage.getItem('mindgrowCompetitions')) localStorage.setItem('mindgrowCompetitions', JSON.stringify([]));

/* Load Competitions */
function loadCompetitions() {
    const user = getCurrentUser();
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]')
        .filter(c => c.school === user.school);

    competitionList.innerHTML = "";
    competitions.forEach((c, idx) => {
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `
            <p><strong>${c.title}</strong> | ${c.date}</p>
            <p>${c.description}</p>
            <button onclick="joinCompetition(${idx})">Join</button>
        `;
        competitionList.appendChild(div);
    });
}

/* Join Competition */
function joinCompetition(idx) {
    const user = getCurrentUser();
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    const competition = competitions[idx];

    if (!competition.participants) competition.participants = [];
    if (competition.participants.includes(user.email)) return alert("Already joined.");

    competition.participants.push(user.email);
    saveCompetitions(competitions);
    addNotification(`Joined competition: ${competition.title}`);
    loadCompetitionLeaderboard(idx);
}

/* Load Competition Leaderboard */
function loadCompetitionLeaderboard(idx) {
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    const competition = competitions[idx];
    if (!competition.participants) return;

    const leaderboard = competition.participants.map(email => {
        const u = getAllUsers().find(usr => usr.email === email);
        return { name: u.name, points: u.points || 0, coins: u.coins || 0 };
    }).sort((a,b) => b.points - a.points);

    competitionLeaderboard.innerHTML = "<h4>Leaderboard</h4>";
    leaderboard.forEach((u, i) => {
        const div = document.createElement('div');
        div.textContent = `${i+1}. ${u.name} - Points: ${u.points} | Coins: ${u.coins}`;
        competitionLeaderboard.appendChild(div);
    });
}

/* Add Competition (HOD/Admin Only) */
function addCompetition(title, description, date) {
    if (!checkRoleAccess(['HOD','Admin'])) return alert("Access denied.");
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    const user = getCurrentUser();

    competitions.push({
        title,
        description,
        date,
        school: user.school,
        participants: []
    });
    saveCompetitions(competitions);
    addNotification(`New competition created: ${title}`);
    loadCompetitions();
}

/* Save Competitions */
function saveCompetitions(list) {
    localStorage.setItem('mindgrowCompetitions', JSON.stringify(list));
}

/* Initialize Competitions on page load */
loadCompetitions();
/* ====== MindGrow Step 2 - Study Chat Groups ====== */

/* DOM Elements */
const studyGroupsContainer = document.getElementById('study-groups-container');
const groupMessagesContainer = document.getElementById('group-messages-container');
const groupMessageInput = document.getElementById('group-message-input');
const groupFileInput = document.getElementById('group-file-input');
const groupSendBtn = document.getElementById('group-send-btn');
const createGroupBtn = document.getElementById('create-group-btn');
const groupNameInput = document.getElementById('group-name-input');

/* Initialize Groups Storage */
if (!localStorage.getItem('mindgrowGroups')) localStorage.setItem('mindgrowGroups', JSON.stringify([]));

/* Load Study Groups */
function loadStudyGroups() {
    const user = getCurrentUser();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');

    studyGroupsContainer.innerHTML = "";
    groups.forEach((g, idx) => {
        if (!g.members.includes(user.email)) return;
        const div = document.createElement('div');
        div.classList.add('menu-card');
        div.innerHTML = `<p onclick="selectGroup(${idx})">${g.name}</p>`;
        studyGroupsContainer.appendChild(div);
    });
}

/* Create Group */
createGroupBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    const name = groupNameInput.value.trim();
    if (!name) return alert("Enter a group name.");

    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups.push({ name, members: [user.email], messages: [] });
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    groupNameInput.value = "";
    addNotification(`Study group created: ${name}`);
    loadStudyGroups();
});

/* Select Group */
let selectedGroupIndex = null;
function selectGroup(idx) {
    selectedGroupIndex = idx;
    loadGroupMessages();
}

/* Load Group Messages */
function loadGroupMessages() {
    if (selectedGroupIndex === null) return;
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups[selectedGroupIndex];
    groupMessagesContainer.innerHTML = "";

    group.messages.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('group-message-card');
        div.innerHTML = `<strong>${msg.author}</strong>: ${msg.text || ''} ${msg.file ? `<a href="${msg.file}" target="_blank">📎</a>` : ''} <span>${msg.timestamp}</span>`;
        groupMessagesContainer.appendChild(div);
    });
}

/* Send Message in Group */
groupSendBtn.addEventListener('click', () => {
    if (selectedGroupIndex === null) return alert("Select a group.");
    const user = getCurrentUser();
    const text = groupMessageInput.value.trim();
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    const group = groups[selectedGroupIndex];

    if (!text && !groupFileInput.files[0]) return alert("Enter text or upload a file.");

    const message = { author: user.name, text: text, file: null, timestamp: new Date().toLocaleString() };

    if (groupFileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            message.file = e.target.result;
            group.messages.push(message);
            saveGroups(groups);
        };
        reader.readAsDataURL(groupFileInput.files[0]);
    } else {
        group.messages.push(message);
        saveGroups(groups);
    }

    groupMessageInput.value = "";
    groupFileInput.value = "";
    loadGroupMessages();
});

/* Save Groups */
function saveGroups(groups) {
    localStorage.setItem('mindgrowGroups', JSON.stringify(groups));
    addNotification(`New message in group: ${groups[selectedGroupIndex].name}`);
}

/* Load Groups on page load */
loadStudyGroups();
/* ====== MindGrow Step 2 - Live Announcements ====== */

/* DOM Elements */
const announcementContainer = document.getElementById('announcement-container');
const announcementTextInput = document.getElementById('announcement-text-input');
const announcementFileInput = document.getElementById('announcement-file-input');
const announcementSubmitBtn = document.getElementById('announcement-submit-btn');
const archivedAnnouncementsContainer = document.getElementById('archived-announcements-container');

/* Initialize Announcements */
if (!localStorage.getItem('mindgrowAnnouncements')) localStorage.setItem('mindgrowAnnouncements', JSON.stringify([]));

/* Submit Announcement (Teachers/HOD Only) */
announcementSubmitBtn.addEventListener('click', () => {
    if (!checkRoleAccess(['Teacher','HOD','Admin'])) return alert("Access denied.");

    const user = getCurrentUser();
    const text = announcementTextInput.value.trim();
    if (!text && !announcementFileInput.files[0]) return alert("Enter text or upload a file.");

    const newAnnouncement = {
        author: user.name,
        email: user.email,
        text,
        file: null,
        timestamp: new Date().toLocaleString()
    };

    if (announcementFileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newAnnouncement.file = e.target.result;
            saveAnnouncement(newAnnouncement);
        };
        reader.readAsDataURL(announcementFileInput.files[0]);
    } else {
        saveAnnouncement(newAnnouncement);
    }

    announcementTextInput.value = "";
    announcementFileInput.value = "";
});

/* Save Announcement */
function saveAnnouncement(announcement) {
    const announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || '[]');
    announcements.push(announcement);
    localStorage.setItem('mindgrowAnnouncements', JSON.stringify(announcements));
    addNotification(`New announcement by ${announcement.author}`);
    loadAnnouncements();
}

/* Load Announcements */
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || '[]');
    const user = getCurrentUser();

    // Live (last 5)
    const live = announcements.slice(-5).reverse();
    announcementContainer.innerHTML = "";
    live.forEach(a => {
        const div = document.createElement('div');
        div.classList.add('announcement-card');
        div.innerHTML = `
            <p><strong>${a.author}</strong> (${a.timestamp})</p>
            <p>${a.text}</p>
            ${a.file ? `<a href="${a.file}" target="_blank">📎 View File</a>` : ""}
        `;
        announcementContainer.appendChild(div);
    });

    // Archived
    const archived = announcements.slice(0, -5).reverse();
    archivedAnnouncementsContainer.innerHTML = "";
    archived.forEach(a => {
        const div = document.createElement('div');
        div.classList.add('announcement-card-archived');
        div.innerHTML = `
            <p><strong>${a.author}</strong> (${a.timestamp})</p>
            <p>${a.text}</p>
            ${a.file ? `<a href="${a.file}" target="_blank">📎 View File</a>` : ""}
        `;
        archivedAnnouncementsContainer.appendChild(div);
    });
}

/* Auto-refresh announcements every 10 seconds */
setInterval(loadAnnouncements, 10000);

/* Load on page load */
loadAnnouncements();
/* ====== MindGrow Step 2 - VS Mode / Multiplayer ====== */

/* DOM Elements */
const vsModeContainer = document.getElementById('vs-mode-container');
const vsStartBtn = document.getElementById('vs-start-btn');
const vsQuestionContainer = document.getElementById('vs-question-container');
const vsAnswerButtons = document.getElementById('vs-answer-buttons');
const vsLeaderboardContainer = document.getElementById('vs-leaderboard');

/* Example VS Questions */
const vsQuestions = [
    { q: "5 × 7 ?", a: ["30","35","32","40"], correct: "35" },
    { q: "Symbol for Gold?", a: ["Au","Ag","Fe","Pb"], correct: "Au" },
    { q: "Process of water cycle?", a: ["Evaporation","Photosynthesis","Condensation","Transpiration"], correct: "Evaporation" },
];

/* VS State */
let vsCurrentQuestion = 0;
let vsParticipants = []; // will contain {email, name, score}
let vsCurrentUser = getCurrentUser();

/* Start VS Mode */
vsStartBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    vsParticipants = [{ email: user.email, name: user.name, score: 0 }];
    vsCurrentQuestion = 0;
    loadVSQuestion();
    addNotification(`${user.name} started a VS match!`);
});

/* Load VS Question */
function loadVSQuestion() {
    if (vsCurrentQuestion >= vsQuestions.length) return finishVSMatch();

    const q = vsQuestions[vsCurrentQuestion];
    vsQuestionContainer.textContent = q.q;
    vsAnswerButtons.innerHTML = "";

    q.a.forEach(ans => {
        const btn = document.createElement('button');
        btn.textContent = ans;
        btn.classList.add('vs-btn');
        btn.addEventListener('click', () => submitVSAnswer(ans));
        vsAnswerButtons.appendChild(btn);
    });
}

/* Submit VS Answer */
function submitVSAnswer(answer) {
    const q = vsQuestions[vsCurrentQuestion];
    const userScore = vsParticipants.find(p => p.email === vsCurrentUser.email);

    if (answer === q.correct) {
        userScore.score += 10;
        vsCurrentUser.points = (vsCurrentUser.points || 0) + 10;
        vsCurrentUser.coins = (vsCurrentUser.coins || 0) + 5;
    }

    // Track AI performance
    trackExerciseAnswer("VS Mode", answer === q.correct);
    saveAllUsers([...getAllUsers().map(u => u.email === vsCurrentUser.email ? vsCurrentUser : u)]);

    vsCurrentQuestion++;
    loadVSQuestion();
}

/* Finish VS Match */
function finishVSMatch() {
    addNotification(`VS Match finished! ${vsCurrentUser.name} scored ${vsParticipants[0].score} points.`);
    loadVSLeaderboard();
}

/* Load VS Leaderboard */
function loadVSLeaderboard() {
    vsLeaderboardContainer.innerHTML = "<h4>VS Leaderboard</h4>";
    vsParticipants.sort((a,b) => b.score - a.score).forEach((p,i) => {
        const div = document.createElement('div');
        div.textContent = `${i+1}. ${p.name} - Score: ${p.score}`;
        vsLeaderboardContainer.appendChild(div);
    });
}

/* Auto-refresh VS Leaderboard every 5 seconds */
setInterval(loadVSLeaderboard, 5000);
/* ====== MindGrow Step 2 - Profile Management Updates ====== */

/* DOM Elements */
const profileNameInput = document.getElementById('profile-name-input');
const profileBioInput = document.getElementById('profile-bio-input');
const profilePicInput = document.getElementById('profile-pic-input');
const profileSaveBtn = document.getElementById('profile-save-btn');
const profileRoleStatus = document.getElementById('profile-role-status');

/* Load Current Profile */
function loadProfile() {
    const user = getCurrentUser();
    if (!user) return;

    profileNameInput.value = user.name || "";
    profileBioInput.value = user.bio || "";
    profileRoleStatus.textContent = user.roleApproved ? `Role: ${user.role}` : "Role approval pending";
}

/* Save Profile Updates */
profileSaveBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    const allUsers = getAllUsers();
    user.name = profileNameInput.value.trim() || user.name;
    user.bio = profileBioInput.value.trim() || user.bio;

    if (profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.profilePic = e.target.result;
            saveProfile(user, allUsers);
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        saveProfile(user, allUsers);
    }
});

/* Save Profile Helper */
function saveProfile(user, allUsers) {
    const updatedUsers = allUsers.map(u => u.email === user.email ? user : u);
    saveAllUsers(updatedUsers);
    addNotification(`Profile updated: ${user.name}`);
    loadProfile();
}

/* Request Role Upgrade (non-student) */
function requestRoleUpgrade(newRole) {
    const user = getCurrentUser();
    if (!user) return;
    if (user.role === "Student") return alert("You are already a student.");
    user.requestedRole = newRole;
    user.roleApproved = false;
    saveAllUsers([...getAllUsers().map(u => u.email === user.email ? user : u)]);
    addNotification(`${user.name} requested role upgrade to ${newRole}`);
    loadProfile();
}

/* Check Role Access Helper */
function checkRoleAccess(allowedRoles) {
    const user = getCurrentUser();
    return user && allowedRoles.includes(user.role) && user.roleApproved;
}

/* Initialize Profile on page load */
loadProfile();
/* ====== MindGrow Step 2 - AI Adaptive Analytics / Tips Panel ====== */

/* DOM Elements */
const aiTipsContainer = document.getElementById('ai-tips-container');

/* Initialize AI Data Storage */
if (!localStorage.getItem('mindgrowAI')) localStorage.setItem('mindgrowAI', JSON.stringify({}));

/* Track Exercise / Quiz / VS Performance */
function trackExerciseAnswer(topic, correct) {
    const user = getCurrentUser();
    if (!user) return;

    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}');

    if (!aiData[user.email]) aiData[user.email] = {};
    if (!aiData[user.email][topic]) aiData[user.email][topic] = { total: 0, correct: 0 };

    aiData[user.email][topic].total += 1;
    if (correct) aiData[user.email][topic].correct += 1;

    localStorage.setItem('mindgrowAI', JSON.stringify(aiData));
    loadAITips();
}

/* Load AI Tips Panel */
function loadAITips() {
    const user = getCurrentUser();
    if (!user) return;

    const aiData = JSON.parse(localStorage.getItem('mindgrowAI') || '{}')[user.email] || {};
    let tipsHtml = "<h4>AI Suggestions</h4>";

    Object.keys(aiData).forEach(topic => {
        const data = aiData[topic];
        const accuracy = data.total ? ((data.correct / data.total) * 100).toFixed(1) : 0;
        if (accuracy < 50) tipsHtml += `<p>💡 Focus on ${topic} (Accuracy: ${accuracy}%)</p>`;
        else if (accuracy < 80) tipsHtml += `<p>👍 Good at ${topic} (Accuracy: ${accuracy}%)</p>`;
        else tipsHtml += `<p>🏆 Excellent at ${topic} (Accuracy: ${accuracy}%)</p>`;
    });

    if (Object.keys(aiData).length === 0) tipsHtml += "<p>No data yet. Start participating!</p>";

    aiTipsContainer.innerHTML = tipsHtml;
}

/* Auto-refresh AI tips every 10 seconds */
setInterval(loadAITips, 10000);

/* Initialize on page load */
loadAITips();
/* ====== MindGrow Step 2 - Search & Explore Integration ====== */

/* DOM Elements */
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');

/* Search Function */
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const results = [];

    if (!query) {
        searchResultsContainer.innerHTML = "";
        return;
    }

    /* Search Users */
    getAllUsers().forEach(u => {
        if (u.name.toLowerCase().includes(query)) {
            results.push({ type: "User", name: u.name, email: u.email });
        }
    });

    /* Search Groups */
    const groups = JSON.parse(localStorage.getItem('mindgrowGroups') || '[]');
    groups.forEach(g => {
        if (g.name.toLowerCase().includes(query)) results.push({ type: "Group", name: g.name });
    });

    /* Search Competitions */
    const competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions') || '[]');
    competitions.forEach(c => {
        if (c.title.toLowerCase().includes(query)) results.push({ type: "Competition", name: c.title });
    });

    /* Search Posts */
    const posts = JSON.parse(localStorage.getItem('mindgrowPosts') || '[]');
    posts.forEach(p => {
        if ((p.content || "").toLowerCase().includes(query)) results.push({ type: "Post", name: p.content.substring(0, 50) + "..." });
    });

    displaySearchResults(results);
});

/* Display Search Results */
function displaySearchResults(results) {
    searchResultsContainer.innerHTML = "";
    if (results.length === 0) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    results.forEach(r => {
        const div = document.createElement('div');
        div.classList.add('search-result-card');
        div.innerHTML = `<strong>${r.type}:</strong> ${r.name}`;
        searchResultsContainer.appendChild(div);
    });
}

/* Initialize Search Results on page load */
searchInput.value = "";
searchResultsContainer.innerHTML = "";
/* ====== MindGrow Step 2 - Misc Bug Fixes & Final Hooks ====== */

/* DOM Elements */
const appScreens = document.querySelectorAll('.screen');

/* Screen Navigation Helper */
function showScreen(screenId) {
    appScreens.forEach(s => s.style.display = "none");
    const target = document.getElementById(screenId);
    if (target) target.style.display = "block";
}

/* Default Screen */
showScreen('welcome-screen');

/* Initialize LocalStorage Defaults */
function initializeDefaults() {
    if (!localStorage.getItem('mindgrowUsers')) localStorage.setItem('mindgrowUsers', JSON.stringify([]));
    if (!localStorage.getItem('mindgrowCompetitions')) localStorage.setItem('mindgrowCompetitions', JSON.stringify([]));
    if (!localStorage.getItem('mindgrowGroups')) localStorage.setItem('mindgrowGroups', JSON.stringify([]));
    if (!localStorage.getItem('mindgrowPosts')) localStorage.setItem('mindgrowPosts', JSON.stringify([]));
    if (!localStorage.getItem('mindgrowAnnouncements')) localStorage.setItem('mindgrowAnnouncements', JSON.stringify([]));
    if (!localStorage.getItem('mindgrowAI')) localStorage.setItem('mindgrowAI', JSON.stringify({}));
}

/* App-wide Event Listeners */
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaults();
    loadDashboardStats();
    loadCompetitions();
    loadStudyGroups();
    loadAnnouncements();
    loadAITips();
});

/* Auto-save Current User Periodically */
setInterval(() => {
    const user = getCurrentUser();
    if (!user) return;
    const allUsers = getAllUsers();
    saveAllUsers([...allUsers.map(u => u.email === user.email ? user : u)]);
}, 15000);

/* Error Catching Wrapper */
window.addEventListener('error', function(e) {
    console.error("MindGrow Error:", e.message, e.filename, e.lineno);
    addNotification("An unexpected error occurred. Check console for details.");
});

/* General Helper Functions (if not defined in previous chunks) */
function getAllUsers() {
    return JSON.parse(localStorage.getItem('mindgrowUsers') || '[]');
}
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('mindgrowCurrentUser') || 'null');
}
function saveAllUsers(users) {
    localStorage.setItem('mindgrowUsers', JSON.stringify(users));
}
function addNotification(msg) {
    const notifContainer = document.getElementById('notifications-container');
    if (!notifContainer) return;
    const div = document.createElement('div');
    div.classList.add('notification-card');
    div.textContent = msg;
    notifContainer.prepend(div);
    setTimeout(() => div.remove(), 7000);
}
