/* ====================== SCREEN NAVIGATION ====================== */
function goToScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  updateDashboard();
  updateStreaks();
  updateAITips();
  showMessages();
  showAnnouncements();
}

/* ====================== USERS / SIGNUP ====================== */
function completeSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const school = document.getElementById('signup-school').value.trim();
  const grade = document.getElementById('signup-grade').value;
  const role = document.getElementById('signup-role').value;
  const password = document.getElementById('signup-password').value;

  if (!name || !email || !school || !grade || !role || !password) {
    alert('Please fill all fields.');
    return;
  }

  const user = { name, email, school, grade, role, password };
  localStorage.setItem('mindgrowUser', JSON.stringify(user));

  alert(`Welcome ${name}!`);
  goToScreen('main-menu');
}

/* ====================== PDF READER ====================== */
const pdfInput = document.getElementById('pdf-upload');
const pdfPreview = document.getElementById('pdf-preview');

if (pdfInput) {
  pdfInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      pdfPreview.src = url;
    } else {
      alert('Please select a valid PDF file.');
      pdfPreview.src = '';
    }
  });
}

/* ====================== QUIZZES ====================== */
function startQuiz() {
  const container = document.getElementById('quiz-container');
  const questions = [
    { q: "2 + 2 = ?", a: ["3", "4", "5"], correct: 1 },
    { q: "Capital of Zambia?", a: ["Lusaka", "Harare", "Nairobi"], correct: 0 },
    { q: "Formula of water?", a: ["H2O", "CO2", "O2"], correct: 0 }
  ];
  let score = 0;

  container.innerHTML = "";

  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.innerHTML = `<p>${q.q}</p>` + q.a.map((ans, j) =>
      `<button onclick="checkAnswer(this, ${j}, ${q.correct}, ${i})">${ans}</button>`).join('');
    container.appendChild(div);
  });

  function checkAnswer(btn, selected, correct, index) {
    if (selected === correct) {
      btn.style.background = 'green';
      score++;
    } else {
      btn.style.background = 'red';
    }
    // Disable all buttons for this question
    container.children[index].querySelectorAll('button').forEach(b => b.disabled = true);
  }
}

/* ====================== STREAKS ====================== */
function updateStreaks() {
  const streakEl = document.getElementById('streak-info');
  let streak = parseInt(localStorage.getItem('mindgrowStreak') || "0");
  streak++;
  localStorage.setItem('mindgrowStreak', streak);
  streakEl.innerText = `Your current study streak: ${streak} days`;
}

/* ====================== DASHBOARD ====================== */
function updateDashboard() {
  const dashboardEl = document.getElementById('dashboard-info');
  const user = JSON.parse(localStorage.getItem('mindgrowUser') || "{}");
  const streak = parseInt(localStorage.getItem('mindgrowStreak') || "0");

  dashboardEl.innerText =
    `Name: ${user.name || 'N/A'}\n` +
    `School: ${user.school || 'N/A'}\n` +
    `Grade: ${user.grade || 'N/A'}\n` +
    `Role: ${user.role || 'N/A'}\n` +
    `Current Streak: ${streak} days`;
}

/* ====================== MESSAGING ====================== */
function sendMessage() {
  const input = document.getElementById('message-input');
  const msg = input.value.trim();
  if (!msg) return;

  let msgs = JSON.parse(localStorage.getItem('mindgrowMessages') || "[]");
  const user = JSON.parse(localStorage.getItem('mindgrowUser') || "{}");
  msgs.push({ from: user.name, text: msg });
  localStorage.setItem('mindgrowMessages', JSON.stringify(msgs));

  input.value = "";
  showMessages();
}

function showMessages() {
  const container = document.getElementById('messages');
  const msgs = JSON.parse(localStorage.getItem('mindgrowMessages') || "[]");
  container.innerHTML = "";
  msgs.forEach(m => {
    const p = document.createElement('p');
    p.innerText = `${m.from}: ${m.text}`;
    container.appendChild(p);
  });
  container.scrollTop = container.scrollHeight;
}

/* ====================== ANNOUNCEMENTS ====================== */
function postAnnouncement() {
  const input = document.getElementById('announcement-input');
  const ann = input.value.trim();
  if (!ann) return;

  let anns = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || "[]");
  const user = JSON.parse(localStorage.getItem('mindgrowUser') || "{}");
  anns.push({ from: user.name, text: ann });
  localStorage.setItem('mindgrowAnnouncements', JSON.stringify(anns));

  input.value = "";
  showAnnouncements();
}

function showAnnouncements() {
  const container = document.getElementById('announcements');
  const anns = JSON.parse(localStorage.getItem('mindgrowAnnouncements') || "[]");
  container.innerHTML = "";
  anns.forEach(a => {
    const p = document.createElement('p');
    p.innerText = `${a.from}: ${a.text}`;
    container.appendChild(p);
  });
}

/* ====================== AI SUGGESTIONS ====================== */
function updateAITips() {
  const tips = document.getElementById('ai-tips');
  const user = JSON.parse(localStorage.getItem('mindgrowUser') || "{}");
  const streak = parseInt(localStorage.getItem('mindgrowStreak') || "0");

  tips.innerText =
    `Hello ${user.name || 'User'}!\n` +
    `Your current streak is ${streak} days.\n` +
    `Keep up the good work! Try reading PDFs and taking quizzes daily.\n` +
    `AI recommends: Focus on ${user.grade || 'your subjects'} today.`;
}

/* ====================== INITIALIZE ====================== */
window.onload = () => { goToScreen('welcome-screen'); }
