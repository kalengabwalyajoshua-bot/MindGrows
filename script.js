// Add new subject input
document.getElementById("add-subject").addEventListener("click", () => {
  const container = document.getElementById("subjects-container");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "subject";
  input.placeholder = "Enter a subject";
  container.appendChild(input);
});

// Analyze function
function analyze() {
  const name = document.getElementById("name").value.trim();
  const subjects = Array.from(document.getElementsByClassName("subject"))
                        .map(input => input.value.trim())
                        .filter(s => s !== "");
  const hours = parseFloat(document.getElementById("hours").value);
  const result = document.getElementById("result");

  if (!name || subjects.length === 0 || isNaN(hours) || hours < 0) {
    result.innerText = "⚠️ Please fill all fields correctly!";
    return;
  }

  let advice = "";
  if (hours < 1) {
    advice = "You should increase your study time gradually.";
  } else if (hours < 2) {
    advice = "Good start! Focus on consistency for better results.";
  } else if (hours < 4) {
    advice = "Great effort! Keep revising and practicing daily.";
  } else {
    advice = "Amazing dedication! Just remember to take short breaks.";
  }

  const phrases = [
    "You can achieve anything with focus! 💪",
    "Believe in yourself and keep pushing forward! 🌟",
    "Learning is a journey — enjoy each step! 📘",
    "Small daily efforts lead to big results! 🚀"
  ];

  // Build personalized feedback
  let feedback = `Hello ${name}! 👋\n\n`;
  subjects.forEach(sub => {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    feedback += `Subject: ${sub}\nAdvice: ${advice}\n${phrase}\n\n`;
  });

  result.innerText = feedback.trim();
}
