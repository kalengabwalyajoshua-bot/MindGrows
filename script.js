// script.js

// ===== GLOBAL STATE =====
let currentUser = null;
let userProfile = null;
let simulationResults = null;
let animationsEnabled = true;
let currentTimeline = 6;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    if (currentUser && userProfile) {
        navigateTo('dashboard-screen');
        loadDashboardData();
    }
}

// ===== NAVIGATION =====
function navigateTo(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Special handling for specific screens
        if (screenId === 'dashboard-screen' && userProfile) {
            loadDashboardData();
        } else if (screenId === 'comparison-screen' && userProfile) {
            initializeComparison();
        } else if (screenId === 'scenario-screen' && userProfile) {
            initializeScenarios();
        }
    }
}

// ===== LOGIN =====
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const validation = document.getElementById('login-validation');
    
    // Simple validation
    if (username.length < 3) {
        validation.textContent = 'Username must be at least 3 characters';
        validation.className = 'validation-message error';
        return;
    }
    
    if (password.length < 4) {
        validation.textContent = 'Password must be at least 4 characters';
        validation.className = 'validation-message error';
        return;
    }
    
    // Simulate login success
    validation.textContent = 'Login successful! Redirecting...';
    validation.className = 'validation-message success';
    
    currentUser = { username };
    saveToStorage();
    
    setTimeout(() => {
        if (userProfile) {
            navigateTo('dashboard-screen');
        } else {
            navigateTo('profile-screen');
        }
    }, 1000);
}

function demoLogin() {
    currentUser = { username: 'Demo User' };
    
    // Set demo profile
    userProfile = {
        studyHours: 5,
        sleepHours: 7,
        screenTime: 5,
        stressLevel: 4,
        exerciseFreq: 4,
        goal: 'balance'
    };
    
    saveToStorage();
    
    const validation = document.getElementById('login-validation');
    validation.textContent = 'Demo login successful! Redirecting...';
    validation.className = 'validation-message success';
    
    setTimeout(() => {
        navigateTo('dashboard-screen');
    }, 1000);
}

// ===== PROFILE SETUP =====
function updateSliderValue(type, value) {
    const element = document.getElementById(`${type}-value`);
    if (element) {
        if (type === 'stress' || type === 'exercise') {
            element.textContent = value;
        } else {
            element.textContent = value;
        }
    }
}

function saveProfile(event) {
    event.preventDefault();
    
    userProfile = {
        studyHours: parseFloat(document.getElementById('study-hours').value),
        sleepHours: parseFloat(document.getElementById('sleep-hours').value),
        screenTime: parseFloat(document.getElementById('screen-time').value),
        stressLevel: parseInt(document.getElementById('stress-level').value),
        exerciseFreq: parseInt(document.getElementById('exercise-freq').value),
        goal: document.getElementById('goal').value
    };
    
    saveToStorage();
    navigateTo('dashboard-screen');
}

// ===== DASHBOARD =====
function loadDashboardData() {
    if (!userProfile) return;
    
    // Update profile summary
    document.getElementById('dash-study').textContent = userProfile.studyHours + 'h';
    document.getElementById('dash-sleep').textContent = userProfile.sleepHours + 'h';
    document.getElementById('dash-screen').textContent = userProfile.screenTime + 'h';
    document.getElementById('dash-stress').textContent = userProfile.stressLevel + '/10';
    document.getElementById('dash-exercise').textContent = userProfile.exerciseFreq + '/wk';
    
    // If simulation was run before, show results
    if (simulationResults) {
        displaySimulationResults();
    }
}

function runSimulation() {
    const btn = document.getElementById('sim-btn-text');
    btn.textContent = '⏳ Simulating...';
    
    setTimeout(() => {
        simulationResults = calculateMetrics(userProfile);
        saveToStorage();
        displaySimulationResults();
        btn.textContent = '↻ Run Again';
    }, 1500);
}

function calculateMetrics(profile) {
    // Productivity Score Calculation
    const baseProductivity = profile.studyHours * 10;
    const sleepBonus = Math.min(profile.sleepHours, 9) * 10;
    const screenPenalty = -(profile.screenTime * 3);
    const stressPenalty = -(profile.stressLevel * 2);
    const exerciseBonus = profile.exerciseFreq * 3;
    
    let productivity = baseProductivity + sleepBonus + screenPenalty + stressPenalty + exerciseBonus;
    productivity = Math.max(0, Math.min(100, productivity));
    
    // Burnout Risk Calculation
    const stressRisk = profile.stressLevel * 10;
    const screenRisk = profile.screenTime * 2;
    const sleepProtection = -(profile.sleepHours * 5);
    const exerciseProtection = -(profile.exerciseFreq * 3);
    
    let burnout = stressRisk + screenRisk + sleepProtection + exerciseProtection;
    burnout = Math.max(0, Math.min(100, burnout));
    
    // Academic Trajectory Calculation
    const studyBase = profile.studyHours * 8;
    const focusQuality = (8 - Math.min(profile.screenTime, 8)) * 5;
    const cognitiveHealth = (profile.sleepHours * 6) - (profile.stressLevel * 3);
    const consistency = profile.exerciseFreq * 2;
    
    let academic = studyBase + focusQuality + cognitiveHealth + consistency;
    academic = Math.max(0, Math.min(100, academic));
    
    // Mental Well-being Calculation
    const wellbeingBase = 50;
    const sleepQuality = profile.sleepHours * 5;
    const stressImpact = -(profile.stressLevel * 5);
    const exerciseBenefit = profile.exerciseFreq * 4;
    const screenImpact = -(profile.screenTime * 2);
    
    let wellbeing = wellbeingBase + sleepQuality + stressImpact + exerciseBenefit + screenImpact;
    wellbeing = Math.max(0, Math.min(100, wellbeing));
    
    return {
        productivity: Math.round(productivity),
        burnout: Math.round(burnout),
        academic: Math.round(academic),
        wellbeing: Math.round(wellbeing)
    };
}

function displaySimulationResults() {
    const container = document.getElementById('results-container');
    container.style.display = 'grid';
    
    // Update productivity
    updateMetricCard('productivity', simulationResults.productivity);
    
    // Update burnout
    updateMetricCard('burnout', simulationResults.burnout);
    
    // Update academic
    updateMetricCard('academic', simulationResults.academic);
    
    // Update wellbeing
    updateMetricCard('wellbeing', simulationResults.wellbeing);
}

function updateMetricCard(type, value) {
    const scoreElement = document.getElementById(`${type}-score`);
    const barElement = document.getElementById(`${type}-bar`);
    const descElement = document.getElementById(`${type}-desc`);
    
    scoreElement.textContent = value + '/100';
    
    // Animate bar
    setTimeout(() => {
        barElement.style.width = value + '%';
    }, 100);
    
    // Set color based on type and value
    if (type === 'burnout') {
        if (value < 30) {
            barElement.style.background = 'linear-gradient(90deg, #00ff88, #00d9ff)';
            descElement.textContent = 'Low risk - Excellent balance maintained';
        } else if (value < 60) {
            barElement.style.background = 'linear-gradient(90deg, #ffaa00, #ff7700)';
            descElement.textContent = 'Moderate risk - Consider reducing stress factors';
        } else {
            barElement.style.background = 'linear-gradient(90deg, #ff3366, #cc0044)';
            descElement.textContent = 'High risk - Immediate lifestyle changes recommended';
        }
    } else {
        if (value >= 70) {
            barElement.style.background = 'linear-gradient(90deg, #00ff88, #00d9ff)';
            descElement.textContent = 'Excellent - Keep up the great work!';
        } else if (value >= 40) {
            barElement.style.background = 'linear-gradient(90deg, #ffaa00, #00d9ff)';
            descElement.textContent = 'Good - Room for improvement';
        } else {
            barElement.style.background = 'linear-gradient(90deg, #ff3366, #ffaa00)';
            descElement.textContent = 'Needs attention - Consider habit adjustments';
        }
    }
}

// ===== COMPARISON SCREEN =====
function initializeComparison() {
    if (!userProfile) return;
    
    // Set current habits
    displayCurrentMetrics();
    
    // Set improved habits defaults
    document.getElementById('comp-study').value = Math.min(userProfile.studyHours + 1, 16);
    document.getElementById('comp-sleep').value = Math.min(userProfile.sleepHours + 1, 12);
    document.getElementById('comp-screen').value = Math.max(userProfile.screenTime - 2, 0);
    document.getElementById('comp-stress').value = Math.max(userProfile.stressLevel - 2, 1);
    document.getElementById('comp-exercise').value = Math.min(userProfile.exerciseFreq + 2, 7);
    
    updateComparison();
}

function displayCurrentMetrics() {
    const currentResults = calculateMetrics(userProfile);
    const container = document.getElementById('current-metrics');
    
    container.innerHTML = `
        <div class="comparison-item">
            <span class="comparison-label">Productivity</span>
            <span class="comparison-value neutral">${currentResults.productivity}/100</span>
        </div>
        <div class="comparison-item">
            <span class="comparison-label">Burnout Risk</span>
            <span class="comparison-value neutral">${currentResults.burnout}/100</span>
        </div>
        <div class="comparison-item">
            <span class="comparison-label">Academic</span>
            <span class="comparison-value neutral">${currentResults.academic}/100</span>
        </div>
        <div class="comparison-item">
            <span class="comparison-label">Well-being</span>
            <span class="comparison-value neutral">${currentResults.wellbeing}/100</span>
        </div>
    `;
}

function updateComparison() {
    // Update slider displays
    document.getElementById('comp-study-value').textContent = document.getElementById('comp-study').value;
    document.getElementById('comp-sleep-value').textContent = document.getElementById('comp-sleep').value;
    document.getElementById('comp-screen-value').textContent = document.getElementById('comp-screen').value;
    document.getElementById('comp-stress-value').textContent = document.getElementById('comp-stress').value;
    document.getElementById('comp-exercise-value').textContent = document.getElementById('comp-exercise').value;
    
    const improvedProfile = {
        studyHours: parseFloat(document.getElementById('comp-study').value),
        sleepHours: parseFloat(document.getElementById('comp-sleep').value),
        screenTime: parseFloat(document.getElementById('comp-screen').value),
        stressLevel: parseInt(document.getElementById('comp-stress').value),
        exerciseFreq: parseInt(document.getElementById('comp-exercise').value),
        goal: userProfile.goal
    };
    
    const currentResults = calculateMetrics(userProfile);
    const improvedResults = calculateMetrics(improvedProfile);
    
    // Display improved metrics
    const container = document.getElementById('improved-metrics');
    container.innerHTML = `
        <div class="comparison-item">
            <span class="comparison-label">Productivity</span>
            <span class="comparison-value ${getChangeClass(improvedResults.productivity, currentResults.productivity)}">${improvedResults.productivity}/100 (${getChange(improvedResults.productivity, currentResults.productivity)})</span>
        </div>
        <div class="comparison-item">
            <span class="comparison-label">Burnout Risk</span>
            <span class="comparison-value ${getChangeClass(currentResults.burnout, improvedResults.burnout)}">${improvedResults.burnout}/100 (${getChange(currentResults.burnout, improvedResults.burnout, true)})</span>
        </div>
        <div class="comparison-item">
            <span class="comparison-label">Academic</span>
            <span class="comparison-value ${getChangeClass(improvedResults.academic, currentResults.academic)}">${improvedResults.academic}/100 (${getChange(improvedResults.academic, currentResults.academic)})</span>
        </div>
        <div class="comparison-item">
            <span class="comparison-label">Well-being</span>
            <span class="comparison-value ${getChangeClass(improvedResults.wellbeing, currentResults.wellbeing)}">${improvedResults.wellbeing}/100 (${getChange(improvedResults.wellbeing, currentResults.wellbeing)})</span>
        </div>
    `;
    
    // Draw comparison chart
    drawComparisonChart(currentResults, improvedResults);
}

function getChange(newVal, oldVal, inverse = false) {
    const diff = inverse ? (oldVal - newVal) : (newVal - oldVal);
    if (diff > 0) return '+' + diff;
    return diff.toString();
}

function getChangeClass(newVal, oldVal) {
    if (newVal > oldVal) return 'positive';
    if (newVal < oldVal) return 'negative';
    return 'neutral';
}

function drawComparisonChart(current, improved) {
    const canvas = document.getElementById('comparison-chart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const metrics = ['Productivity', 'Burnout Risk', 'Academic', 'Well-being'];
    const currentData = [current.productivity, current.burnout, current.academic, current.wellbeing];
    const improvedData = [improved.productivity, improved.burnout, improved.academic, improved.wellbeing];
    
    const barWidth = 60;
    const spacing = 120;
    const startX = 80;
    const startY = 250;
    const maxHeight = 200;
    
    // Draw bars
    metrics.forEach((metric, index) => {
        const x = startX + (index * spacing);
        
        // Current bar
        const currentHeight = (currentData[index] / 100) * maxHeight;
        ctx.fillStyle = 'rgba(0, 217, 255, 0.6)';
        ctx.fillRect(x, startY - currentHeight, barWidth / 2 - 5, currentHeight);
        
        // Improved bar
        const improvedHeight = (improvedData[index] / 100) * maxHeight;
        ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
        ctx.fillRect(x + barWidth / 2 + 5, startY - improvedHeight, barWidth / 2 - 5, improvedHeight);
        
        // Labels
        ctx.fillStyle = '#a0a0b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(metric, x + barWidth / 2, startY + 20);
        
        // Values
        ctx.fillStyle = '#00d9ff';
        ctx.fillText(currentData[index], x + barWidth / 4, startY - currentHeight - 10);
        ctx.fillStyle = '#00ff88';
        ctx.fillText(improvedData[index], x + 3 * barWidth / 4, startY - improvedHeight - 10);
    });
    
    // Legend
    ctx.fillStyle = '#00d9ff';
    ctx.fillRect(startX, 20, 20, 20);
    ctx.fillStyle = '#e8e8f0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Current Habits', startX + 30, 35);
    
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(startX + 180, 20, 20, 20);
    ctx.fillStyle = '#e8e8f0';
    ctx.fillText('Improved Habits', startX + 210, 35);
}

// ===== SCENARIO EXPLORER =====
function initializeScenarios() {
    if (!userProfile) return;
    
    currentTimeline = 6;
    drawTimelineChart(userProfile);
    displayScenarioOutcome(userProfile, userProfile);
}

function applyScenario(type) {
    if (!userProfile) return;
    
    let scenarioProfile = { ...userProfile };
    
    switch (type) {
        case 'sleep':
            scenarioProfile.sleepHours = Math.min(scenarioProfile.sleepHours + 2, 12);
            break;
        case 'screen':
            scenarioProfile.screenTime = Math.max(scenarioProfile.screenTime - 3, 0);
            break;
        case 'consistency':
            scenarioProfile.studyHours = Math.min(scenarioProfile.studyHours + 1, 16);
            scenarioProfile.exerciseFreq = Math.min(scenarioProfile.exerciseFreq + 1, 7);
            scenarioProfile.stressLevel = Math.max(scenarioProfile.stressLevel - 1, 1);
            break;
        case 'exercise':
            scenarioProfile.exerciseFreq = 7;
            break;
        case 'reset':
            scenarioProfile = { ...userProfile };
            break;
    }
    
    drawTimelineChart(scenarioProfile);
    displayScenarioOutcome(userProfile, scenarioProfile);
}

function setTimeline(months) {
    currentTimeline = months;
    document.getElementById('timeline-3').classList.remove('active');
    document.getElementById('timeline-6').classList.remove('active');
    document.getElementById(`timeline-${months}`).classList.add('active');
    
    // Redraw with current scenario
    const container = document.getElementById('scenario-outcome');
    if (container.dataset.scenarioProfile) {
        const scenarioProfile = JSON.parse(container.dataset.scenarioProfile);
        drawTimelineChart(scenarioProfile);
    } else {
        drawTimelineChart(userProfile);
    }
}

function drawTimelineChart(profile) {
    const canvas = document.getElementById('timeline-chart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const months = currentTimeline;
    const points = months + 1;
    const spacing = 700 / months;
    const startX = 50;
    const startY = 250;
    
    // Calculate progression
    const currentResults = calculateMetrics(userProfile);
    const targetResults = calculateMetrics(profile);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = startY - (i * 40);
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + 700, y);
        ctx.stroke();
        
        ctx.fillStyle = '#a0a0b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(i * 20, startX - 10, y + 5);
    }
    
    // Draw lines for each metric
    const metrics = [
        { key: 'productivity', color: '#00d9ff', label: 'Productivity' },
        { key: 'academic', color: '#7b2ff7', label: 'Academic' },
        { key: 'wellbeing', color: '#00ff88', label: 'Well-being' }
    ];
    
    metrics.forEach(metric => {
        ctx.strokeStyle = metric.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i <= months; i++) {
            const progress = i / months;
            const value = currentResults[metric.key] + (targetResults[metric.key] - currentResults[metric.key]) * progress;
            const x = startX + (i * spacing);
            const y = startY - (value * 2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw point
            ctx.fillStyle = metric.color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.stroke();
    });
    
    // Draw x-axis labels
    ctx.fillStyle = '#a0a0b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= months; i++) {
        const x = startX + (i * spacing);
        ctx.fillText(`Month ${i}`, x, startY + 25);
    }
    
    // Legend
    const legendX = startX;
    const legendY = 30;
    metrics.forEach((metric, index) => {
        const x = legendX + (index * 150);
        ctx.fillStyle = metric.color;
        ctx.fillRect(x, legendY, 15, 15);
        ctx.fillStyle = '#e8e8f0';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(metric.label, x + 20, legendY + 12);
    });
}

function displayScenarioOutcome(current, scenario) {
    const currentResults = calculateMetrics(current);
    const scenarioResults = calculateMetrics(scenario);
    
    const container = document.getElementById('scenario-outcome');
    container.dataset.scenarioProfile = JSON.stringify(scenario);
    
    const changes = [
        {
            label: 'Productivity',
            current: currentResults.productivity,
            scenario: scenarioResults.productivity,
            inverse: false
        },
        {
            label: 'Burnout Risk',
            current: currentResults.burnout,
            scenario: scenarioResults.burnout,
            inverse: true
        },
        {
            label: 'Academic Trajectory',
            current: currentResults.academic,
            scenario: scenarioResults.academic,
            inverse: false
        },
        {
            label: 'Mental Well-being',
            current: currentResults.wellbeing,
            scenario: scenarioResults.wellbeing,
            inverse: false
        }
    ];
    
    let html = '';
    changes.forEach(change => {
        const diff = change.inverse ? 
            (change.current - change.scenario) : 
            (change.scenario - change.current);
        
        const changeClass = diff > 0 ? 'positive' : (diff < 0 ? 'negative' : 'neutral');
        const arrow = diff > 0 ? '↑' : (diff < 0 ? '↓' : '→');
        
        html += `
            <div class="outcome-item">
                <div class="outcome-label">${change.label}</div>
                <div class="outcome-change ${changeClass}">
                    ${arrow} ${Math.abs(diff)} points
                    <span style="color: var(--text-secondary); font-size: 0.9rem; margin-left: 10px;">
                        (${change.current} → ${change.scenario})
                    </span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ===== SETTINGS =====
function toggleAnimations() {
    animationsEnabled = document.getElementById('animations-toggle').checked;
    
    if (animationsEnabled) {
        document.body.classList.remove('no-animations');
    } else {
        document.body.classList.add('no-animations');
    }
    
    saveToStorage();
}

function exportData() {
    const data = {
        user: currentUser,
        profile: userProfile,
        results: simulationResults,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'digital-twin-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

function confirmReset() {
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function resetAllData() {
    localStorage.clear();
    currentUser = null;
    userProfile = null;
    simulationResults = null;
    
    closeModal();
    navigateTo('welcome-screen');
}

// ===== LOCAL STORAGE =====
function saveToStorage() {
    const data = {
        user: currentUser,
        profile: userProfile,
        results: simulationResults,
        animations: animationsEnabled
    };
    
    localStorage.setItem('digitalTwinData', JSON.stringify(data));
}

function loadFromStorage() {
    const stored = localStorage.getItem('digitalTwinData');
    
    if (stored) {
        const data = JSON.parse(stored);
        currentUser = data.user;
        userProfile = data.profile;
        simulationResults = data.results;
        animationsEnabled = data.animations !== false;
        
        if (!animationsEnabled) {
            document.body.classList.add('no-animations');
            document.getElementById('animations-toggle').checked = false;
        }
    }
}
