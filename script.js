// --- SCREEN MANAGEMENT ---
function goToScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

// --- SIGN UP LOGIC ---
function completeSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const school = document.getElementById('signup-school').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!name || !email || !school || !password) {
    alert('⚠️ Please fill all fields.');
    return;
  }

  // Save to local storage (can expand later for real database)
  const user = { name, email, school };
  localStorage.setItem('mindgrowUser', JSON.stringify(user));

  alert(`Welcome ${name}! Your account has been created.`);
  goToScreen('main-menu');
}

// --- PDF UPLOAD PLACEHOLDER ---
const pdfInput = document.getElementById('pdf-upload');
if (pdfInput) {
  pdfInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      alert(`PDF "${file.name}" loaded! (PDF reader will be implemented later)`);
    } else {
      alert('Please select a valid PDF file.');
    }
  });
}

// --- INITIALIZE ---
window.onload = () => {
  goToScreen('welcome-screen');
};
