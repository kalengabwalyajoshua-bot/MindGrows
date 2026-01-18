// ================== GLOBAL DATA ==================
const state = {
  currentScreen: 'welcomeScreen',
  previousScreen: null,
  student: null,
  teacher: null,
  classes: [],
  assignments: [],
  chatHistory: []
};

// ================== SCREEN NAVIGATION ==================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  if (!screen) return;
  screen.classList.add('active');
  state.previousScreen = state.currentScreen;
  state.currentScreen = screenId;
}

// ================== BACK BUTTON ==================
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.previousScreen) showScreen(state.previousScreen);
    else showScreen('welcomeScreen');
  });
});

// ================== NAV BAR BUTTONS ==================
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.textContent.toLowerCase();
    switch (name) {
      case 'home': showScreen('homeScreen'); break;
      case 'explore': showScreen('subjectScreen'); break;
      case 'profile': showScreen('profileScreen'); break;
      case 'friends': showScreen('friendsScreen'); break;
      case 'messages': showScreen('messagesScreen'); break;
      case 'dashboard': showScreen('dashboardScreen'); break;
    }
  });
});

// ================== WELCOME SCREEN BUTTONS ==================
const startBtn = document.getElementById('startBtn');
const teacherBtn = document.getElementById('teacherBtn');

startBtn.addEventListener('click', () => showScreen('signupScreen'));
teacherBtn.addEventListener('click', () => showScreen('teacherLoginScreen'));

// ================== STUDENT SIGNUP ==================
document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  state.student = {
    name: document.getElementById('fullName').value,
    school: document.getElementById('schoolName').value,
    class: document.getElementById('className').value
  };
  alert(`Welcome ${state.student.name}!`);
  showScreen('homeScreen');
  updateHomeAssignments();
});

// ================== TEACHER LOGIN ==================
document.getElementById('teacherLoginForm').addEventListener('submit', e => {
  e.preventDefault();
  state.teacher = {
    name: document.getElementById('teacherName').value,
    school: document.getElementById('teacherSchool').value
  };
  alert(`Welcome Teacher ${state.teacher.name}!`);
  showScreen('teacherDashboardScreen');
  updateTeacherClasses();
});

// ================== ASSIGNMENTS ==================
function updateHomeAssignments() {
  const ul = document.querySelector('#homeAssignments ul');
  ul.innerHTML = '';
  if (state.assignments.length === 0) {
    ul.innerHTML = '<li>No assignments yet.</li>';
    return;
  }
  state.assignments.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a.title + (a.completed ? ' ✅' : '');
    ul.appendChild(li);
  });
}

// ================== TEACHER DASHBOARD ==================
document.getElementById('createClassBtn').addEventListener('click', () => {
  const className = document.getElementById('newClassName').value;
  if (!className) return alert('Enter class name');
  state.classes.push({ name: className, assignments: [] });
  updateTeacherClasses();
});

function updateTeacherClasses() {
  const div = document.getElementById('classesList');
  div.innerHTML = '';
  state.classes.forEach((cls, i) => {
    const classDiv = document.createElement('div');
    classDiv.innerHTML = `<h4>${cls.name}</h4><button onclick="addAssignment(${i})">Add Assignment</button>`;
    div.appendChild(classDiv);
  });
}

function addAssignment(classIndex) {
  const title = prompt('Enter assignment title:');
  if (!title) return;
  state.classes[classIndex].assignments.push({ title, completed: false });
  state.assignments.push({ title, completed: false });
  updateHomeAssignments();
  updateTeacherClasses();
}

// ================== AI CHAT ==================
const sendBtn = document.getElementById('sendChatBtn');
const chatInput = document.getElementById('chatInput');
const chatContainer = document.querySelector('.chat-container');

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => { if(e.key === 'Enter') sendMessage(); });

function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  addChatMessage('You', msg);
  chatInput.value = '';
  // Simulate AI response
  setTimeout(() => {
    addChatMessage('AI', `You said: ${msg}`);
  }, 500);
}

function addChatMessage(sender, msg) {
  const div = document.createElement('div');
  div.textContent = `${sender}: ${msg}`;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ================== VOICE COMMAND ==================
const voiceBtn = document.getElementById('voiceBtn');

voiceBtn.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Voice command not supported in this browser.');
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

  recognition.onresult = event => {
    const speech = event.results[0][0].transcript.toLowerCase();
    handleVoiceCommand(speech);
  };

  recognition.onerror = event => alert('Voice recognition error: ' + event.error);
});

function handleVoiceCommand(command) {
  console.log('Voice command received:', command);
  if (command.includes('open math')) showScreen('subjectScreen');
  else if (command.includes('assignments')) showScreen('homeScreen');
  else if (command.includes('dashboard')) showScreen('dashboardScreen');
  else if (command.includes('profile')) showScreen('profileScreen');
  else if (command.includes('friends')) showScreen('friendsScreen');
  else if (command.includes('messages')) showScreen('messagesScreen');
  else if (command.includes('back')) showScreen(state.previousScreen || 'homeScreen');
  else alert('Command not recognized: ' + command);
}

// ================== DASHBOARD STATS ==================
function updateDashboard() {
  document.getElementById('completedAssignments').textContent =
    state.assignments.filter(a => a.completed).length;
  document.getElementById('pendingAssignments').textContent =
    state.assignments.filter(a => !a.completed).length;
  // Placeholder for strongest/weakest subjects
  document.getElementById('strongSubjects').textContent = 'Math, Science';
  document.getElementById('weakSubjects').textContent = 'History';
}

// Auto-update dashboard every 2s
setInterval(() => {
  if (state.currentScreen === 'dashboardScreen') updateDashboard();
}, 2000);
