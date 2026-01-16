/* ====== USER INITIALIZATION ====== */
if(!localStorage.getItem('mindgrowUser')){
  const defaultUser = {
    name: 'Guest',
    email: '',
    role: 'student',
    school: '',
    bio: '',
    profilePic: 'https://img.icons8.com/fluency/48/000000/user-male-circle.png',
    points: 0,
    coins: 0,
    streak: 0
  };
  localStorage.setItem('mindgrowUser', JSON.stringify(defaultUser));
}

/* ====== SCREEN NAVIGATION ====== */
function goToScreen(screenId){
  document.querySelectorAll('.screen').forEach(s=>{
    s.classList.add('hidden');
  });
  const screen = document.getElementById(screenId);
  if(screen) screen.classList.remove('hidden');
}

/* ====== TOP BAR / PROFILE DROPDOWN ====== */
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');

profileIcon.addEventListener('click',()=>{
  profileDropdown.style.display = profileDropdown.style.display==='block'?'none':'block';
});

/* ====== UPDATE PROFILE INFO ON TOP BAR ====== */
function updateProfileInfo(){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const topProfilePic = document.getElementById('top-profile-pic');
  const topName = document.getElementById('top-user-name');
  if(topProfilePic) topProfilePic.src = user.profilePic || 'https://img.icons8.com/fluency/48/000000/user-male-circle.png';
  if(topName) topName.innerText = user.name || 'Guest';
}

/* ====== NOTIFICATIONS PLACEHOLDER ====== */
function updateNotifications(){
  const notifCount = document.getElementById('notif-count');
  // example: 0 notifications initially
  if(notifCount) notifCount.innerText = 0;
}

/* ====== SEARCH SUGGESTIONS ====== */
const searchInput = document.getElementById('top-search');
const suggestionBox = document.createElement('div');
suggestionBox.style.position='absolute';
suggestionBox.style.background='white';
suggestionBox.style.border='1px solid #ccc';
suggestionBox.style.width='45%';
suggestionBox.style.maxHeight='200px';
suggestionBox.style.overflowY='auto';
suggestionBox.style.zIndex='1001';
searchInput.parentNode.appendChild(suggestionBox);

searchInput.addEventListener('input',()=>{
  const query = searchInput.value.toLowerCase();
  suggestionBox.innerHTML='';
  if(!query) return;
  const users = [JSON.parse(localStorage.getItem('mindgrowUser')||"{}")]; // extend with all users later
  users.forEach(u=>{
    if(u.name && u.name.toLowerCase().includes(query)){
      const item = document.createElement('div');
      item.style.padding='5px';
      item.style.cursor='pointer';
      item.innerText = u.name;
      item.onclick = ()=>{ alert(`View Profile: ${u.name}`); suggestionBox.innerHTML=''; };
      suggestionBox.appendChild(item);
    }
  });
});

/* ====== CLICK OUTSIDE TO HIDE DROPDOWNS ====== */
document.addEventListener('click', function(event){
  if(!profileDropdown.contains(event.target) && !profileIcon.contains(event.target)){
    profileDropdown.style.display='none';
  }
  if(!searchInput.contains(event.target)){
    suggestionBox.innerHTML='';
  }
});

/* ====== HELPER: ROLE & SCHOOL VALIDATION ====== */
function checkUserRole(requiredRoles){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  return requiredRoles.includes(user.role);
}

function checkSchool(schoolName){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  return user.school === schoolName;
}

/* ====== INITIALIZE APP STATE ====== */
function initializeApp(){
  updateProfileInfo();
  updateNotifications();
  goToScreen('welcome-screen');
}
window.addEventListener('load',initializeApp);
/* ====== MAIN MENU BUTTON HANDLERS ====== */
function openClubs() {
  if(!checkUserRole(['teacher','hod','headteacher'])){
    alert('Students can only join clubs created by HODs/Teachers.');
    return;
  }
  goToScreen('clubs-screen');
}

function openVSMode() { goToScreen('vs-mode-screen'); }
function openQuizzes() { goToScreen('quiz-screen'); }
function openExercises() { goToScreen('quiz-screen'); }
function openPDFReader() { goToScreen('pdf-screen'); }
function openMessages() { goToScreen('groups-screen'); }
function openAnnouncements() { goToScreen('announcements-screen'); }
function openAISuggestions() { alert('AI Suggestions feature active!'); }
function openStreaks() { goToScreen('streaks-screen'); }
function openDashboard() { alert('Dashboard coming soon!'); }

/* ====== FEEDS / POSTS ====== */
let feedPosts = JSON.parse(localStorage.getItem('mindgrowFeeds')||"[]");
let pendingPosts = JSON.parse(localStorage.getItem('mindgrowPending')||"[]");

function addFeedPost(content,type='class'){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const post = {
    id:Date.now(),
    author:user.name,
    profilePic:user.profilePic,
    content,
    type,
    likes:0,
    comments:[],
    approved: checkUserRole(['teacher','hod','headteacher']),
    date:new Date().toLocaleString()
  };
  if(post.approved) feedPosts.push(post);
  else pendingPosts.push(post);
  localStorage.setItem('mindgrowFeeds',JSON.stringify(feedPosts));
  localStorage.setItem('mindgrowPending',JSON.stringify(pendingPosts));
  renderFeeds();
}

function renderFeeds(){
  const container = document.getElementById('feeds-container');
  if(!container) return;
  container.innerHTML='';
  feedPosts.forEach(post=>{
    const card = document.createElement('div');
    card.className='menu-card';
    card.innerHTML=`
      <img src="${post.profilePic}" alt="${post.author}">
      <span><b>${post.author}</b> (${post.date})</span>
      <p>${post.content}</p>
      <div style="margin-top:8px; display:flex; justify-content:space-around;">
        <button onclick="likePost(${post.id})">❤️ ${post.likes}</button>
        <button onclick="commentPost(${post.id})">💬 ${post.comments.length}</button>
        <button onclick="sharePost(${post.id})">🔗 Share</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function likePost(postId){
  const post = feedPosts.find(p=>p.id===postId);
  if(post){ post.likes++; localStorage.setItem('mindgrowFeeds',JSON.stringify(feedPosts)); renderFeeds(); }
}

function commentPost(postId){
  const comment = prompt('Enter your comment:');
  if(comment){
    const post = feedPosts.find(p=>p.id===postId);
    post.comments.push(comment);
    localStorage.setItem('mindgrowFeeds',JSON.stringify(feedPosts));
    renderFeeds();
  }
}

function sharePost(postId){
  alert('Post shared!');
}

/* ====== STUDY CHAT GROUPS ====== */
let studyGroups = JSON.parse(localStorage.getItem('mindgrowGroups')||"[]");

function createGroup(name,description){
  if(!checkUserRole(['teacher','hod','headteacher'])) { alert('Only higher roles can create groups'); return; }
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const group = { id:Date.now(), name, description, members:[user.email], messages:[] };
  studyGroups.push(group);
  localStorage.setItem('mindgrowGroups',JSON.stringify(studyGroups));
  renderGroups();
}

function renderGroups(){
  const container = document.getElementById('groups-container');
  if(!container) return;
  container.innerHTML='';
  studyGroups.forEach(group=>{
    const card = document.createElement('div');
    card.className='menu-card';
    card.innerHTML=`
      <img src="https://img.icons8.com/fluency/48/000000/group.png" alt="${group.name}">
      <span>${group.name}</span>
      <p>${group.description}</p>
      <button onclick="openGroupChat(${group.id})">Open Chat</button>
    `;
    container.appendChild(card);
  });
}

function openGroupChat(groupId){
  const group = studyGroups.find(g=>g.id===groupId);
  if(!group) return;
  let chat = prompt(`Group: ${group.name}\nType your message (or 'view' to see chat):`);
  if(chat==='view'){ alert(group.messages.map(m=>`${m.sender}: ${m.text}`).join('\n') || 'No messages yet'); return; }
  if(chat){
    const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
    group.messages.push({sender:user.name,text:chat,date:new Date().toLocaleString()});
    localStorage.setItem('mindgrowGroups',JSON.stringify(studyGroups));
    alert('Message sent!');
  }
}

/* ====== COMPETITIONS ====== */
let competitions = JSON.parse(localStorage.getItem('mindgrowCompetitions')||"[]");

function createCompetition(name){
  if(!checkUserRole(['teacher','hod','headteacher'])) { alert('Only higher roles can create competitions'); return; }
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const comp = { id:Date.now(), name, school:user.school, participants:[], scores:[] };
  competitions.push(comp);
  localStorage.setItem('mindgrowCompetitions',JSON.stringify(competitions));
  renderCompetitions();
}

function renderCompetitions(){
  const container = document.getElementById('competitions-container');
  if(!container) return;
  container.innerHTML='';
  competitions.forEach(comp=>{
    const card = document.createElement('div');
    card.className='menu-card';
    card.innerHTML=`
      <img src="https://img.icons8.com/fluency/48/000000/trophy.png">
      <span>${comp.name} (${comp.school})</span>
      <button onclick="joinCompetition(${comp.id})">Join</button>
    `;
    container.appendChild(card);
  });
}

function joinCompetition(compId){
  const comp = competitions.find(c=>c.id===compId);
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  if(comp.participants.includes(user.email)){ alert('Already joined'); return; }
  if(comp.school!==user.school){ alert('Only students of this school can join'); return; }
  comp.participants.push(user.email);
  localStorage.setItem('mindgrowCompetitions',JSON.stringify(competitions));
  alert(`Joined ${comp.name}`);
}

/* ====== ANNOUNCEMENTS ====== */
let announcements = JSON.parse(localStorage.getItem('mindgrowAnnouncements')||"[]");

function createAnnouncement(content){
  if(!checkUserRole(['teacher','hod','headteacher'])){ alert('Only higher roles can announce'); return; }
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const ann = { id:Date.now(), author:user.name, profilePic:user.profilePic, content, date:new Date().toLocaleString() };
  announcements.push(ann);
  localStorage.setItem('mindgrowAnnouncements',JSON.stringify(announcements));
  renderAnnouncements();
}

function renderAnnouncements(){
  const container = document.getElementById('announcements-container');
  if(!container) return;
  container.innerHTML='';
  announcements.forEach(a=>{
    const card=document.createElement('div');
    card.className='menu-card';
    card.innerHTML=`
      <img src="${a.profilePic}" alt="${a.author}">
      <span><b>${a.author}</b> (${a.date})</span>
      <p>${a.content}</p>
    `;
    container.appendChild(card);
  });
}
/* ====== QUIZZES & EXERCISES ====== */
let quizzes = [
  {id:1,question:"What is 2+2?",options:["3","4","5"],answer:1},
  {id:2,question:"Capital of Zambia?",options:["Lusaka","Ndola","Kitwe"],answer:0},
  {id:3,question:"H2O is?",options:["Oxygen","Water","Hydrogen"],answer:1},
  {id:4,question:"Speed of light approx?",options:["3x10^8 m/s","3x10^6 m/s","3x10^5 m/s"],answer:0},
  {id:5,question:"Largest planet?",options:["Earth","Jupiter","Mars"],answer:1},
  {id:6,question:"What is photosynthesis?",options:["Plant food","Sunlight","Water"],answer:0},
  {id:7,question:"2^3=?",options:["5","6","8"],answer:2},
  {id:8,question:"Who discovered gravity?",options:["Newton","Einstein","Tesla"],answer:0},
  {id:9,question:"Chemical symbol for gold?",options:["Au","Ag","Fe"],answer:0},
  {id:10,question:"Speed of sound?",options:["343 m/s","300 m/s","500 m/s"],answer:0}
];

function loadQuizzes(){
  const container = document.getElementById('quiz-container');
  if(!container) return;
  container.innerHTML='';
  quizzes.forEach(q=>{
    const card = document.createElement('div');
    card.className='menu-card';
    let optionsHtml='';
    q.options.forEach((opt,i)=>{
      optionsHtml+=`<button onclick="submitAnswer(${q.id},${i})">${opt}</button>`;
    });
    card.innerHTML=`
      <span><b>Q:</b> ${q.question}</span>
      <div style="margin-top:5px">${optionsHtml}</div>
    `;
    container.appendChild(card);
  });
}

function submitAnswer(qId,optIndex){
  const quiz = quizzes.find(q=>q.id===qId);
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  let pointsEarned=0;
  if(optIndex===quiz.answer){
    alert('Correct! 🎉');
    pointsEarned=10; // base points
  } else { alert('Incorrect! ❌'); }
  user.points = (user.points||0)+pointsEarned;
  user.coins = (user.coins||0) + Math.floor(pointsEarned/2);
  localStorage.setItem('mindgrowUser', JSON.stringify(user));
  alert(`Points: ${pointsEarned} | Coins earned: ${Math.floor(pointsEarned/2)} | Total Points: ${user.points} | Total Coins: ${user.coins}`);
  showStreaks();
}

/* ====== STREAKS & DASHBOARD ====== */
function showStreaks(){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const streakScreen = document.getElementById('streaks-screen');
  if(!streakScreen) return;
  streakScreen.innerHTML=`
    <h2>Streaks & Dashboard</h2>
    <p>Total Points: ${user.points||0}</p>
    <p>Total Coins: ${user.coins||0}</p>
    <p>Current Streak: ${user.streak||0} days</p>
  `;
}

/* ====== VS MODE CHALLENGE HANDLING ====== */
let activeChallenges = JSON.parse(localStorage.getItem('mindgrowChallenges')||"[]");

function startChallenge(){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const targetEmail = document.getElementById('challenge-email').value.trim();
  const type = document.getElementById('challenge-type').value;
  const coins = parseInt(document.getElementById('challenge-coins').value);

  if(!targetEmail || !type || !coins || coins <=0){
    alert('Fill all fields correctly');
    return;
  }
  if(user.coins < coins){ alert('Not enough coins'); return; }
  if(targetEmail === user.email){ alert('Cannot challenge yourself'); return; }

  user.coins -= coins;
  localStorage.setItem('mindgrowUser', JSON.stringify(user));

  const challenge = {
    id: Date.now(),
    from:user.email,
    to:targetEmail,
    type,
    coins,
    status:'pending'
  };
  activeChallenges.push(challenge);
  localStorage.setItem('mindgrowChallenges', JSON.stringify(activeChallenges));
  renderChallenges();
  alert(`Challenge sent to ${targetEmail}!`);
}

function renderChallenges(){
  const log = document.getElementById('challenge-log');
  if(!log) return;
  log.innerHTML='';
  activeChallenges.forEach(c=>{
    const div = document.createElement('div');
    div.style.background='#fff'; div.style.padding='10px'; div.style.margin='5px'; div.style.borderRadius='8px'; div.style.boxShadow='0 2px 5px rgba(0,0,0,0.1)';
    div.innerHTML=`From: ${c.from} | To: ${c.to} | Type: ${c.type} | Coins: ${c.coins} | Status: ${c.status}`;
    log.appendChild(div);
  });
}

function completeChallenge(challengeId, winnerEmail){
  const challenge = activeChallenges.find(c=>c.id===challengeId);
  if(!challenge) return;
  challenge.status='completed';
  if(challenge.from === winnerEmail){
    const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
    user.coins += challenge.coins*2;
    localStorage.setItem('mindgrowUser', JSON.stringify(user));
    alert(`You won! Coins earned: ${challenge.coins*2}`);
  }
  localStorage.setItem('mindgrowChallenges', JSON.stringify(activeChallenges));
  renderChallenges();
}

/* ====== AI SUGGESTIONS ====== */
function showAISuggestions(){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  const tips = [
    `Keep up your streaks! Try exercises today for bonus points.`,
    `Complete a quiz to earn coins for VS Mode.`,
    `Join a study group to share notes and files.`,
    `Check announcements for competitions in your school.`,
    `Challenge a classmate in VS Mode to earn more coins!`
  ];
  const tip = tips[Math.floor(Math.random()*tips.length)];
  alert(`AI Suggestion: ${tip}`);
}

/* ====== COINS / REWARD LOGIC ====== */
function earnCoins(points){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  user.coins = (user.coins||0) + points;
  localStorage.setItem('mindgrowUser', JSON.stringify(user));
  alert(`You earned ${points} coins! Total Coins: ${user.coins}`);
}

/* ====== INITIALIZE QUIZZES / DASHBOARD ====== */
window.addEventListener('load', ()=>{
  loadQuizzes();
  showStreaks();
  renderChallenges();
});
/* ====== PROFILE EDITING ====== */
function openProfileEditor(){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  document.getElementById('edit-bio').value = user.bio || '';
  document.getElementById('edit-profile-pic').value = user.profilePic || '';
  goToScreen('profile-screen');
}

function saveProfile(){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  user.bio = document.getElementById('edit-bio').value;
  user.profilePic = document.getElementById('edit-profile-pic').value;
  localStorage.setItem('mindgrowUser', JSON.stringify(user));
  updateProfileInfo();
  alert('Profile updated!');
  goToScreen('main-menu');
}

/* ====== TOP BAR NOTIFICATIONS ====== */
function addNotification(message){
  const notifCountElem = document.getElementById('notif-count');
  let count = parseInt(notifCountElem.innerText)||0;
  notifCountElem.innerText = count+1;
  console.log(`Notification: ${message}`);
}

function clearNotifications(){
  const notifCountElem = document.getElementById('notif-count');
  notifCountElem.innerText = 0;
}

/* ====== SEARCH BAR POLISH ====== */
const searchInputTop = document.getElementById('top-search');
const suggestionBoxTop = document.createElement('div');
suggestionBoxTop.style.position='absolute';
suggestionBoxTop.style.background='white';
suggestionBoxTop.style.border='1px solid #ccc';
suggestionBoxTop.style.width='45%';
suggestionBoxTop.style.maxHeight='200px';
suggestionBoxTop.style.overflowY='auto';
suggestionBoxTop.style.zIndex='1001';
searchInputTop.parentNode.appendChild(suggestionBoxTop);

searchInputTop.addEventListener('input',()=>{
  const query = searchInputTop.value.toLowerCase();
  suggestionBoxTop.innerHTML='';
  if(!query) return;
  const users = [JSON.parse(localStorage.getItem('mindgrowUser')||"{}")]; // extend for all users later
  users.forEach(u=>{
    if(u.name && u.name.toLowerCase().includes(query)){
      const item = document.createElement('div');
      item.style.padding='5px';
      item.style.cursor='pointer';
      item.innerText = u.name;
      item.onclick = ()=>{ alert(`View Profile: ${u.name}`); suggestionBoxTop.innerHTML=''; };
      suggestionBoxTop.appendChild(item);
    }
  });
});

/* ====== CLICK OUTSIDE TO HIDE DROPDOWNS ====== */
document.addEventListener('click', function(event){
  const profileDropdown = document.getElementById('profile-dropdown');
  if(!profileDropdown.contains(event.target) && !document.getElementById('profile-icon').contains(event.target)){
    profileDropdown.style.display='none';
  }
  if(!searchInputTop.contains(event.target)){
    suggestionBoxTop.innerHTML='';
  }
});

/* ====== SCREEN NAVIGATION HELPERS ====== */
function showScreen(screenId){
  document.querySelectorAll('.screen').forEach(s=>{
    s.classList.add('hidden');
  });
  const screen = document.getElementById(screenId);
  if(screen) screen.classList.remove('hidden');
}

function switchScreen(currentId,nextId){
  document.getElementById(currentId).classList.add('hidden');
  document.getElementById(nextId).classList.remove('hidden');
}

/* ====== APP INITIALIZATION ====== */
function initializeMindGrow(){
  updateProfileInfo();
  updateNotifications();
  renderFeeds();
  renderGroups();
  renderCompetitions();
  renderAnnouncements();
  loadQuizzes();
  showStreaks();
  renderChallenges();
  console.log('MindGrow initialized successfully!');
}

window.addEventListener('load',initializeMindGrow);

/* ====== HELPER: GENERATE RANDOM ID ====== */
function generateId(){ return Date.now()+Math.floor(Math.random()*1000); }

/* ====== PROFILE PICTURE DEFAULT FALLBACK ====== */
function getProfilePic(user){
  return user.profilePic || 'https://img.icons8.com/fluency/48/000000/user-male-circle.png';
}

/* ====== POINTS / COINS UPDATE ====== */
function updatePointsAndCoins(points=0,coins=0){
  const user = JSON.parse(localStorage.getItem('mindgrowUser')||"{}");
  user.points = (user.points||0) + points;
  user.coins = (user.coins||0) + coins;
  localStorage.setItem('mindgrowUser', JSON.stringify(user));
  showStreaks();
}

/* ====== RESET APP STATE FOR TESTING ====== */
function resetMindGrow(){
  if(confirm('Reset all data?')){
    localStorage.clear();
    location.reload();
  }
}

/* ====== FINAL TOUCHES ====== */
document.addEventListener('DOMContentLoaded',()=>{
  updateProfileInfo();
  showStreaks();
  loadQuizzes();
  renderFeeds();
  renderGroups();
  renderCompetitions();
  renderAnnouncements();
  renderChallenges();
});
