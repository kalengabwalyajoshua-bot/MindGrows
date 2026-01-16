function analyze() {
  const name = document.getElementById("name").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const hours = parseFloat(document.getElementById("hours").value);
  const result = document.getElementById("result");

  if (!name || !subject || isNaN(hours) || hours < 0) {
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

  // Random motivational phrases
  const phrases = [
    "You can achieve anything with focus! 💪",
    "Believe in yourself and keep pushing forward! 🌟",
    "Learning is a journey — enjoy each step! 📘",
    "Small daily efforts lead to big results! 🚀"
  ];
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  result.innerText = 
    `Hello ${name}! 👋\n` +
    `For ${subject}:\n` +
    `${advice}\n\n` +
    `${randomPhrase}`;
}
