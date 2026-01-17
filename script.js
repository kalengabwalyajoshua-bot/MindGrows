// Floating particles
const particleCount = 40;
for(let i=0;i<particleCount;i++){
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.width = Math.random() * 12 + 8 + 'px';
    p.style.height = p.style.width;
    p.style.top = Math.random() * 100 + '%';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 5 + 5) + 's';
    p.style.animationDelay = (Math.random() * 5) + 's';
    document.body.appendChild(p);
}

// Enter app from Welcome screen
function enterApp(){
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('homeScreen').classList.remove('hidden');
}

// Open any feature screen
function openFeatureScreen(name){
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('featureTitle').innerText = name;
    const content = document.getElementById('featureContent');
    content.innerHTML = ''; // reset content

    // Feature-specific content
    if(name==='Quizzes'){
        content.innerHTML = `
            <p>Question: What is 5 × 6?</p>
            <div class="quiz-option" onclick="alert('Correct! 🚀')">30</div>
            <div class="quiz-option" onclick="alert('Wrong! ❌')">35</div>
            <div class="quiz-option" onclick="alert('Wrong! ❌')">25</div>
        `;
    } else if(name==='Story'){
        content.innerHTML = `
            <p>Once upon a time in the magical world of MindGrow...</p>
            <p>Knowledge flowed like rivers, and learners explored endlessly.</p>
            <p>Scroll down to read more exciting adventures!</p>
        `;
    } else if(name==='AI Tutor'){
        content.innerHTML = `
            <p>Ask me anything!</p>
            <input type="text" id="aiQuestion" placeholder="Type your question...">
            <button class="submit-btn" onclick="answerAI()">Ask</button>
            <p id="aiAnswer"></p>
        `;
    } else if(name==='Clubs'){
        content.innerHTML = `
            <p>Available Clubs:</p>
            <ul>
                <li>Science Club</li>
                <li>Math Wizards</li>
                <li>History Buffs</li>
            </ul>
        `;
    } else if(name==='Leaderboard'){
        content.innerHTML = `
            <p>Top Learners:</p>
            <ol>
                <li>Jane Doe - 120 pts</li>
                <li>John Smith - 100 pts</li>
                <li>Alice - 95 pts</li>
            </ol>
        `;
    } else if(name==='Notes' || name==='Favorites'){
        content.innerHTML = `
            <p>Add items:</p>
            <input type="text" id="noteInput" placeholder="Type something...">
            <button class="submit-btn" onclick="addNote()">Add</button>
            <ul id="noteList"></ul>
        `;
    } else if(name==='Daily Challenge'){
        const challenges = ["Solve 3 math problems", "Read a science story", "Learn 5 new words"];
        const today = new Date().getDate();
        content.innerHTML = `<p>Today's Challenge: <strong>${challenges[today % challenges.length]}</strong></p>`;
    } else if(name==='Mini Games'){
        content.innerHTML = `
            <p>Guess the number between 1 and 5</p>
            <input type="number" id="guessInput" placeholder="1-5">
            <button class="submit-btn" onclick="checkGuess()">Guess</button>
            <p id="guessResult"></p>
        `;
    } else if(name==='School'){
        content.innerHTML = `
            <p>Welcome to MindGrow School! 🏫</p>
            <p>Classes coming soon...</p>
        `;
    } else{
        content.innerHTML = `<p>Feature "${name}" content coming soon! 🚀</p>`;
    }

    document.getElementById('featureScreen').classList.remove('hidden');
}

// Back button to home
function goBackHome(){
    document.getElementById('featureScreen').classList.add('hidden');
    document.getElementById('homeScreen').classList.remove('hidden');
}

// AI Tutor simple responses
function answerAI(){
    const question = document.getElementById('aiQuestion').value.toLowerCase();
    const answer = document.getElementById('aiAnswer');
    if(question.includes('hello')) answer.innerText = 'Hello! How can I help you today?';
    else if(question.includes('time')) answer.innerText = 'It\'s learning time! ⏰';
    else answer.innerText = 'Interesting question! Keep exploring 🌟';
}

// Notes / Favorites
function addNote(){
    const input = document.getElementById('noteInput');
    const ul = document.getElementById('noteList');
    if(input.value.trim() !== ''){
        const li = document.createElement('li');
        li.innerText = input.value;
        ul.appendChild(li);
        input.value='';
    }
}

// Mini Game - Guess the number
function checkGuess(){
    const num = Math.floor(Math.random()*5)+1;
    const guess = Number(document.getElementById('guessInput').value);
    const result = document.getElementById('guessResult');
    if(guess === num){
        result.innerText = `🎉 Correct! The number was ${num}.`;
    } else {
        result.innerText = `❌ Wrong! The number was ${num}. Try again.`;
    }
}
