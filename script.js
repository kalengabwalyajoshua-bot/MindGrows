// ============================
// GLOBAL VARIABLES
// ============================
const screens = document.querySelectorAll(".screen");
let currentSubject = null;
let currentTeacher = null;
let reminderInterval;
let previousScreen = null;

// ============================
// USER DATA
// ============================
const userData = JSON.parse(localStorage.getItem("mindglowUser")) || {
  visits: 0,
  profile: null,
  subjects: {},
  questionsAsked: 0,
  chatHistory: {},
  teachers: {},
  completedAssignments: {},
  progress: {}
};

function saveUserData() {
  localStorage.setItem("mindglowUser", JSON.stringify(userData));
}

// ============================
// SCREEN HANDLER
// ============================
function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  updateNavBadges();
  if (id === "aiChatScreen") loadAIRecommendations();
  if (id === "dashboardScreen") loadDashboard();
}

// ============================
// BACK BUTTON
// ============================
document.querySelectorAll(".back-btn").forEach(btn => {
  btn.onclick = () => {
    if (previousScreen) showScreen(previousScreen);
  };
});

// ============================
// START FLOW
// ============================
document.getElementById("startBtn").onclick = () => { previousScreen = "welcomeScreen"; showScreen("signupScreen"); };
document.getElementById("teacherBtn").onclick = () => { previousScreen = "welcomeScreen"; showScreen("teacherLoginScreen"); };

// ============================
// STUDENT SIGNUP
// ============================
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
  previousScreen = "signupScreen";
  showScreen("homeScreen");
  loadStudentAssignments();
  startReminders();
};

// ============================
// TEACHER LOGIN
// ============================
document.getElementById("loginTeacherBtn").onclick = () => {
  const teacherName = document.getElementById("teacherName").value.trim();
  const schoolName = document.getElementById("teacherSchool").value.trim();
  
  if (!teacherName || !schoolName) {
    alert("Please fill in all fields.");
    return;
  }

  currentTeacher = teacherName;

  if (!userData.teachers[teacherName]) {
    userData.teachers[teacherName] = { school: schoolName, classes: {} };
    saveUserData();
  }

  previousScreen = "teacherLoginScreen";
  showScreen("teacherDashboardScreen");
  loadClasses();
};

// ============================
// CREATE CLASS (TEACHER)
// ============================
document.getElementById("createClassBtn").onclick = () => {
  const className = document.getElementById("newClassName").value.trim();
  if (!className || !currentTeacher) return;

  const teacher = userData.teachers[currentTeacher];
  if (teacher.classes[className]) {
    alert("Class already exists.");
    return;
  }

  teacher.classes[className] = { assignments: [] };
  saveUserData();
  document.getElementById("newClassName").value = "";
  loadClasses();
};

// ============================
// LOAD CLASSES (TEACHER)
// ============================
function loadClasses() {
  const classesList = document.getElementById("classesList");
  classesList.innerHTML = "";
  const teacher = userData.teachers[currentTeacher];

  for (const cls in teacher.classes) {
    const classDiv = document.createElement("div");
    classDiv.className = "class-item";
    classDiv.innerHTML = `
      <strong>${cls}</strong>
      <button class="primary-btn assignBtn">Add Assignment</button>
      <div class="assignmentsList"></div>
    `;
    classesList.appendChild(classDiv);

    const assignBtn = classDiv.querySelector(".assignBtn");
    assignBtn.onclick = () => {
      const assignmentText = prompt(`Enter assignment for class "${cls}":`);
      if (!assignmentText) return;
      const dueDate = prompt("Enter due date (YYYY-MM-DD):");
      if (!dueDate) return;
      teacher.classes[cls].assignments.push({ text: assignmentText, due: dueDate });
      saveUserData();
      loadClasses();
    };

    const assignmentsList = classDiv.querySelector(".assignmentsList");
    teacher.classes[cls].assignments.forEach(a => {
      const aDiv = document.createElement("div");
      aDiv.textContent = `${a.text} (Due: ${a.due})`;
      assignmentsList.appendChild(aDiv);
    });
  }
}

// ============================
// LOAD STUDENT ASSIGNMENTS
// ============================
function loadStudentAssignments() {
  const container = document.getElementById("homeAssignments");
  if (!container) return;

  container.innerHTML = "<h3>Assignments from Teachers:</h3>";
  const today = new Date();

  for (const teacherName in userData.teachers) {
    const teacher = userData.teachers[teacherName];
    if (teacher.school !== userData.profile?.school) continue;

    for (const cls in teacher.classes) {
      if (cls !== userData.profile?.className) continue;

      const classDiv = document.createElement("div");
      classDiv.innerHTML = `<strong>${cls} (Teacher: ${teacherName})</strong>`;
      const ul = document.createElement("ul");

      teacher.classes[cls].assignments.forEach((a, i) => {
        const li = document.createElement("li");

        const key = `${teacherName}_${cls}_${i}`;
        const isCompleted = userData.completedAssignments[key] || false;

        const dueDate = new Date(a.due);
        let remaining = Math.ceil((dueDate - today) / (1000*60*60*24));
        let countdownText = "";
        let deadlineClass = "";

        if (!isCompleted && remaining < 0) {
          countdownText = "Past Due";
          deadlineClass = "overdue-blink";
        } else if (!isCompleted && remaining === 0) {
          countdownText = "Due Today";
          deadlineClass = "due-today-glow";
        } else if (!isCompleted) {
          countdownText = `${remaining} day(s) left`;
        } else {
          countdownText = "Completed";
          deadlineClass = "completed-fade";
        }

        li.innerHTML = `
          <span style="text-decoration:${isCompleted ? "line-through" : "none"}" class="${deadlineClass}">
            ${a.text} (Due: ${a.due}) - ${countdownText}
          </span>
          <button class="mark-complete-btn">${isCompleted ? "Completed" : "Mark Completed"}</button>
          <button class="ai-tip-btn">Get AI Tip</button>
        `;

        li.querySelector(".mark-complete-btn").onclick = () => {
          userData.completedAssignments[key] = true;
          saveUserData();
          loadStudentAssignments();
        };

        li.querySelector(".ai-tip-btn").onclick = () => {
          alert(generateAITip(a.text));
        };

        ul.appendChild(li);
      });

      classDiv.appendChild(ul);
      container.appendChild(classDiv);
    }
  }

  updateNavBadges();
}

// ============================
// AI TIPS & RECOMMENDATIONS
// ============================
function generateAITip(assignmentText) {
  const tips = [
    `Break down "${assignmentText}" into smaller steps.`,
    `Focus on key points in "${assignmentText}".`,
    `Explain "${assignmentText}" to a friend.`,
    `Review related notes before tackling "${assignmentText}".`,
    `Use diagrams or charts for "${assignmentText}".`
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function generateSubjectRecommendations(subject) {
  const suggestions = [
    `Review previous assignments in ${subject}.`,
    `Focus on topics you struggled with in ${subject}.`,
    `Try answering 5 quick questions on ${subject}.`,
    `Make a small summary of today's ${subject} lessons.`,
    `Check past mistakes in ${subject} and revise them.`
  ];
  return suggestions.sort(() => 0.5 - Math.random()).slice(0,3);
}

function loadAIRecommendations() {
  if (!currentSubject) return;
  const chatContainer = document.querySelector(".chat-container");
  const recommendations = generateSubjectRecommendations(currentSubject);
  recommendations.forEach(r => {
    const bubble = document.createElement("div");
    bubble.className = "chat-message ai-recommendation";
    bubble.textContent = r;
    chatContainer.appendChild(bubble);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ============================
// ADAPTIVE REMINDERS
// ============================
function startReminders() {
  if (reminderInterval) clearInterval(reminderInterval);
  reminderInterval = setInterval(() => {
    let reminders = [];
    const today = new Date();

    for (const teacherName in userData.teachers) {
      const teacher = userData.teachers[teacherName];
      if (teacher.school !== userData.profile?.school) continue;

      for (const cls in teacher.classes) {
        if (cls !== userData.profile?.className) continue;
        teacher.classes[cls].assignments.forEach((a, i) => {
          const key = `${teacherName}_${cls}_${i}`;
          if (userData.completedAssignments[key]) return;
          const dueDate = new Date(a.due);
          const remaining = Math.ceil((dueDate - today) / (1000*60*60*24));
          if (remaining <= 1) reminders.push(`${a.text} is ${remaining <=0 ? "past due" : "due today"}!`);
        });
      }
    }

    if (reminders.length) alert("Reminders:\n" + reminders.join("\n"));
  }, 60000);
}

// ============================
// DASHBOARD (Stage 3)
// ============================
function loadDashboard() {
  const dashboardContainer = document.getElementById("dashboardScreen");
  if (!dashboardContainer) return;
  dashboardContainer.innerHTML = "<h2>Learning Dashboard</h2>";

  // SUBJECT INTERACTION
  const subjects = userData.subjects || {};
  const totalSubjects = Object.keys(subjects).length || 0;

  const ul = document.createElement("ul");
  for (const subject in subjects) {
    const li = document.createElement("li");
    li.textContent = `${subject}: Interacted ${subjects[subject]} time(s)`;
    ul.appendChild(li);
  }

  dashboardContainer.appendChild(ul);

  // ASSIGNMENT PROGRESS GRAPH (simplified)
  const completed = Object.values(userData.completedAssignments).filter(v => v).length;
  const pending = Object.values(userData.completedAssignments).filter(v => !v).length;
  const progressDiv = document.createElement("div");
  progressDiv.innerHTML = `
    <p>Assignments Completed: ${completed}</p>
    <p>Assignments Pending: ${pending}</p>
    <div style="display:flex;">
      <div style="height:20px;width:${completed*5}px;background:green;margin-right:5px;"></div>
      <div style="height:20px;width:${pending*5}px;background:red;"></div>
    </div>
  `;
  dashboardContainer.appendChild(progressDiv);
}

// ============================
// NAV BADGES
// ============================
function updateNavBadges() {
  const homeBtn = document.querySelector(".nav-btn:first-child"); 
  let pending = 0;

  for (const teacherName in userData.teachers) {
    const teacher = userData.teachers[teacherName];
    if (teacher.school !== userData.profile?.school) continue;

    for (const cls in teacher.classes) {
      if (cls !== userData.profile?.className) continue;
      teacher.classes[cls].assignments.forEach((a, i) => {
        const key = `${teacherName}_${cls}_${i}`;
        if (!userData.completedAssignments[key]) pending++;
      });
    }
  }

  let badge = homeBtn.querySelector(".badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "badge";
    homeBtn.appendChild(badge);
  }
  badge.textContent = pending > 0 ? pending : "";
}

// ============================
// NAVIGATION
// ============================
const navMap = {
  Home: "homeScreen",
  Explore: "subjectScreen",
  Profile: "profileScreen",
  Friends: "friendsScreen",
  Messages: "aiChatScreen",
  Dashboard: "dashboardScreen"
};

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    previousScreen = document.querySelector(".screen.active")?.id || null;
    const targetScreen = navMap[btn.textContent.trim()];
    if (targetScreen) showScreen(targetScreen);
  };
});

// ============================
// CATEGORY → SUBJECT
// ============================
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.onclick = () => {
    const category = btn.textContent.trim();
    userData.subjects[category] = (userData.subjects[category] || 0) + 1;
    saveUserData();
    previousScreen = "homeScreen";
    showScreen("subjectScreen");
  };
});

// ============================
// SUBJECT → AI CHAT
// ============================
document.querySelectorAll(".subject-btn").forEach(btn => {
  btn.onclick = () => {
    currentSubject = btn.textContent.trim();
    if (!userData.chatHistory[currentSubject]) userData.chatHistory[currentSubject] = [];
    saveUserData();
    previousScreen = "subjectScreen";
    showScreen("aiChatScreen");
    loadChatHistory();
    loadAIRecommendations();
  };
});

// ============================
// LOAD CHAT HISTORY
// ============================
function loadChatHistory() {
  const chatContainer = document.querySelector(".chat-container");
  chatContainer.innerHTML = "";
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
// AI CHAT
// ============================
document.getElementById("sendChatBtn").onclick = () => {
  const input = document.querySelector(".chat-input input");
  const chat = document.querySelector(".chat-container");
  const msg = input.value.trim();
  if (!msg || !currentSubject) return;

  userData.questionsAsked++;
  const userBubble = "You: " + msg;
  userData.chatHistory[currentSubject].push(userBubble);

  const userDiv = document.createElement("div");
  userDiv.className = "chat-message";
  userDiv.textContent = userBubble;
  chat.appendChild(userDiv);

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
// VOICE COMMANDS (Stage 4)
// ============================
document.getElementById("voiceBtn").onclick = () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice commands not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    handleVoiceCommand(command);
  };

  recognition.start();
};

function handleVoiceCommand(command) {
  // Navigation commands
  if (command.includes("go to dashboard")) return showScreen("dashboardScreen");
  if (command.includes("go back")) return previousScreen ? showScreen(previousScreen) : null;

  // Existing Stage 1 commands
  if (command.includes("show my assignments")) {
    showScreen("homeScreen");
    loadStudentAssignments();
    alert("Showing your assignments.");
  } else if (command.includes("mark") && command.includes("completed")) {
    const assignmentName = command.replace("mark","").replace("completed","").trim();
    markAssignmentByName(assignmentName);
  } else if (command.includes("open ai chat with")) {
    const subject = command.replace("open ai chat with","").trim();
    currentSubject = subject;
    if (!userData.chatHistory[currentSubject]) userData.chatHistory[currentSubject] = [];
    showScreen("aiChatScreen");
    loadChatHistory();
    loadAIRecommendations();
  } else if (command.includes("give me tips for")) {
    const assignment = command.replace("give me tips for","").trim();
    alert(generateAITip(assignment));
  } else if (command.includes("start quiz for")) {
    const subject = command.replace("start quiz for","").trim();
    startQuiz(subject);
  } else {
    alert("Command not recognized: " + command);
    // ============================
// MARK ASSIGNMENT BY NAME (Voice Command)
// ============================
function markAssignmentByName(name) {
  let found = false;
  for (const teacherName in userData.teachers) {
    const teacher = userData.teachers[teacherName];
    if (teacher.school !== userData.profile?.school) continue;

    for (const cls in teacher.classes) {
      if (cls !== userData.profile?.className) continue;
      teacher.classes[cls].assignments.forEach((a,i) => {
        if (a.text.toLowerCase() === name.toLowerCase()) {
          const key = `${teacherName}_${cls}_${i}`;
          userData.completedAssignments[key] = true;
          saveUserData();
          loadStudentAssignments();
          alert(`Assignment "${a.text}" marked completed.`);
          found = true;
        }
      });
    }
  }
  if (!found) alert(`No assignment found with name "${name}"`);
}

// ============================
// QUIZ FUNCTIONALITY (Stage 4)
// ============================
function startQuiz(subject) {
  if (!subject) {
    alert("Please specify a subject for the quiz.");
    return;
  }

  const questions = [
    { q: `What is the main topic in ${subject}?`, a: "Answer depends on subject" },
    { q: `Explain one key concept in ${subject}.`, a: "Answer depends on subject" },
    { q: `Solve a small problem in ${subject}.`, a: "Answer depends on subject" }
  ];

  let score = 0;

  for (let i=0;i<questions.length;i++) {
    const ans = prompt(`Quiz Question ${i+1}: ${questions[i].q}`);
    if (ans && ans.trim() !== "") score++;
  }

  alert(`Quiz completed! You answered ${score} out of ${questions.length} questions.`);
  userData.progress[subject] = (userData.progress[subject] || 0) + score;
  saveUserData();
  loadDashboard();
}

// ============================
// INIT: Load Dashboard & Assignments on Start
// ============================
window.onload = () => {
  if (userData.profile) {
    showScreen("homeScreen");
    loadStudentAssignments();
    startReminders();
  } else {
    showScreen("welcomeScreen");
  }
};
