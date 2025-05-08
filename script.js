// ---------- Signup ----------
function handleSignup(event) {
  event.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);
  alert("Signup successful! Now login.");
  window.location.href = "index.html"; // Login page
}

// ---------- Login ----------
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const savedEmail = localStorage.getItem("userEmail");
  const savedPassword = localStorage.getItem("userPassword");

  if (email === savedEmail && password === savedPassword) {
    alert("Login successful!");
    sessionStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials.");
  }
}

// ---------- Logout ----------
function handleLogout() {
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}

// ---------- Check Login ----------
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    alert("Please login first.");
    window.location.href = "index.html";
  }
}

// ---------- Track Period ----------
function trackPeriod() {
  const startDate = new Date(document.getElementById("startDate").value);
  const mood = document.getElementById("mood").value;
  const flow = document.getElementById("flow").value;
  const note = document.getElementById("note").value;

  if (!startDate) {
    alert("Please select a start date.");
    return;
  }

  const cycleLength = 28;
  const nextPeriod = new Date(startDate);
  nextPeriod.setDate(startDate.getDate() + cycleLength);

  const formattedDate = nextPeriod.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Save log
  const entry = {
    date: startDate.toISOString().split('T')[0],
    mood,
    flow,
    note,
  };

  let periodLogs = JSON.parse(localStorage.getItem("periodLogs")) || [];
  periodLogs.push(entry);
  localStorage.setItem("periodLogs", JSON.stringify(periodLogs));

  alert(`Your next period is expected on ${formattedDate}. Entry saved.`);
}

// ---------- Show History ----------
function showPeriodHistory() {
  const logs = JSON.parse(localStorage.getItem("periodLogs")) || [];

  if (logs.length === 0) {
    alert("No period records found.");
    return;
  }

  let history = "📒 Period History:\n\n";
  logs.forEach((log, index) => {
    history += `Entry ${index + 1}:\n`;
    history += `Date: ${log.date}\nMood: ${log.mood}\nFlow: ${log.flow}\nNote: ${log.note}\n\n`;
  });

  alert(history);
}
