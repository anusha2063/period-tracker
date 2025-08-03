// ---------- Custom Message Box ----------
function showMessage(title, content, icon = '💕', buttons = [], isHTML = false) {
  // Create overlay if it doesn't exist
  let overlay = document.getElementById('messageOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'messageOverlay';
    overlay.className = 'message-overlay';
    overlay.innerHTML = `
      <div class="message-box">
        <div class="message-icon" id="messageIcon">💕</div>
        <div class="message-title" id="messageTitle">Title</div>
        <div class="message-content" id="messageContent">Content</div>
        <div class="message-buttons" id="messageButtons"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        hideMessage();
      }
    });
  }
  
  // Update content
  document.getElementById('messageIcon').textContent = icon;
  document.getElementById('messageTitle').textContent = title;
  
  const contentElement = document.getElementById('messageContent');
  if (isHTML) {
    contentElement.innerHTML = content;
  } else {
    contentElement.textContent = content;
  }
  
  // Update buttons
  const buttonsContainer = document.getElementById('messageButtons');
  buttonsContainer.innerHTML = '';
  
  if (buttons.length === 0) {
    buttons = [{ text: 'OK', type: 'primary', action: hideMessage }];
  }
  
  buttons.forEach(button => {
    const btn = document.createElement('button');
    btn.className = `message-btn ${button.type || 'primary'}`;
    btn.textContent = button.text;
    btn.onclick = button.action || hideMessage;
    buttonsContainer.appendChild(btn);
  });
  
  // Show overlay
  overlay.classList.add('show');
}

function hideMessage() {
  const overlay = document.getElementById('messageOverlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// ---------- Signup ----------
function handleSignup(event) {
  event.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    showMessage('Required Fields', 'Please fill in all fields.', '⚠️');
    return;
  }

  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);
  showMessage('Success!', 'Signup successful! Now login.', '✨', [
    { text: 'Login', type: 'primary', action: () => { hideMessage(); window.location.href = "index.html"; } }
  ]);
}

// ---------- Login ----------
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const savedEmail = localStorage.getItem("userEmail");
  const savedPassword = localStorage.getItem("userPassword");

  if (email === savedEmail && password === savedPassword) {
    showMessage('Welcome Back!', 'Login successful!', '🩸', [
      { text: 'Continue', type: 'primary', action: () => { hideMessage(); sessionStorage.setItem("isLoggedIn", "true"); window.location.href = "dashboard.html"; } }
    ]);
  } else {
    showMessage('Login Failed', 'Invalid credentials. Please try again.', '❌');
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
    showMessage('Access Denied', 'Please login first.', '🔒', [
      { text: 'Login', type: 'primary', action: () => { hideMessage(); window.location.href = "index.html"; } }
    ]);
  }
}

// ---------- Track Period ----------
function trackPeriod() {
  const startDate = new Date(document.getElementById("startDate").value);
  const mood = document.getElementById("mood").value;
  const flow = document.getElementById("flow").value;
  const note = document.getElementById("note").value;

  if (!startDate || isNaN(startDate.getTime())) {
    showMessage('Missing Information', 'Please select a valid start date.', '📅');
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

  showMessage(
    'Period Tracked! 🩸',
    `Your next period is expected on ${formattedDate}.\n\nEntry has been saved successfully!`,
    '💕',
    [
      { text: 'View History', type: 'secondary', action: () => { hideMessage(); showPeriodHistory(); } },
      { text: 'Done', type: 'primary', action: hideMessage }
    ]
  );
}

// ---------- Show History ----------
function showPeriodHistory() {
  const logs = JSON.parse(localStorage.getItem("periodLogs")) || [];

  if (logs.length === 0) {
    showMessage('No Records', 'No period records found yet.\n\nStart tracking your period to see your history here!', '📝');
    return;
  }

  let historyHTML = '';
  logs.reverse().forEach((log, index) => {
    const date = new Date(log.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    
    const entryNumber = logs.length - index;
    
    historyHTML += `
      <div class="history-entry">
        <div class="history-entry-header">
          <span class="history-entry-number">Entry ${entryNumber}</span>
          <span class="history-entry-date">${date}</span>
        </div>
        <div class="history-entry-details">
          <div class="history-detail-item">
            <span class="history-detail-emoji">😊</span>
            <span>Mood: ${log.mood}</span>
          </div>
          <div class="history-detail-item">
            <span class="history-detail-emoji">🩸</span>
            <span>Flow: ${log.flow}</span>
          </div>
        </div>
        ${log.note ? `<div class="history-note">📝 Note: ${log.note}</div>` : ''}
      </div>
    `;
  });

  showMessage(
    'Period History 📒',
    historyHTML,
    '📊',
    [
      { text: 'Clear History', type: 'secondary', action: () => { hideMessage(); clearHistory(); } },
      { text: 'Close', type: 'primary', action: hideMessage }
    ],
    true // isHTML flag
  );
}

// ---------- Clear History ----------
function clearHistory() {
  showMessage(
    'Clear History?',
    'Are you sure you want to delete all period records?\n\nThis action cannot be undone.',
    '⚠️',
    [
      { text: 'Cancel', type: 'secondary', action: hideMessage },
      { 
        text: 'Delete All', 
        type: 'primary', 
        action: () => {
          localStorage.removeItem("periodLogs");
          showMessage('History Cleared', 'All period records have been deleted.', '✅');
        }
      }
    ]
  );
}

// ---------- AI Chatbot ----------
class PeriodHealthChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.knowledgeBase = {
      'period pain': {
        keywords: ['pain', 'cramps', 'ache', 'hurt', 'painful'],
        response: "Period pain (dysmenorrhea) is common and can be managed with:\n\n• Heat therapy (heating pads, warm baths)\n• Over-the-counter pain relievers (ibuprofen, naproxen)\n• Light exercise and stretching\n• Staying hydrated\n• Getting enough rest\n\nIf pain is severe or interferes with daily activities, consult a healthcare provider."
      },
      'cycle length': {
        keywords: ['cycle', 'length', 'long', 'short', 'irregular', 'regular'],
        response: "A normal menstrual cycle is typically 21-35 days, with periods lasting 3-7 days.\n\n• Cycles can vary from month to month\n• Stress, weight changes, and hormones can affect cycle length\n• Track your cycles to identify patterns\n• Consult a doctor if cycles are consistently very short (<21 days) or long (>35 days)"
      },
      'flow': {
        keywords: ['flow', 'heavy', 'light', 'bleeding', 'spotting'],
        response: "Menstrual flow can vary:\n\n**Light flow:** Less than 1-2 pads/tampons per day\n**Normal flow:** 3-6 pads/tampons per day\n**Heavy flow:** More than 7+ pads/tampons per day\n\n🚨 See a doctor if:\n• Bleeding through a pad/tampon every hour\n• Periods last longer than 7 days\n• Bleeding between periods"
      },
      'pregnancy': {
        keywords: ['pregnant', 'pregnancy', 'missed period', 'late'],
        response: "A missed period can indicate pregnancy, especially if you're sexually active.\n\nOther early pregnancy signs:\n• Nausea or morning sickness\n• Breast tenderness\n• Fatigue\n• Frequent urination\n\nTake a pregnancy test if your period is late and consult a healthcare provider for confirmation."
      },
      'pms': {
        keywords: ['pms', 'mood', 'bloating', 'symptoms', 'emotional'],
        response: "PMS (Premenstrual Syndrome) affects many women:\n\n**Common symptoms:**\n• Mood changes, irritability\n• Bloating and water retention\n• Breast tenderness\n• Food cravings\n• Fatigue\n\n**Management tips:**\n• Regular exercise\n• Balanced diet\n• Stress management\n• Adequate sleep\n• Limit caffeine and salt"
      },
      'birth control': {
        keywords: ['birth control', 'contraception', 'pill', 'iud'],
        response: "Birth control can affect your menstrual cycle:\n\n• **Birth control pills:** May lighten periods or stop them\n• **IUDs:** Can make periods lighter or heavier depending on type\n• **Implants/Shots:** May cause irregular bleeding or stop periods\n\nChanges are usually normal, but discuss concerns with your healthcare provider."
      },
      'exercise': {
        keywords: ['exercise', 'workout', 'gym', 'sports', 'fitness'],
        response: "Exercise during your period is generally safe and beneficial:\n\n**Benefits:**\n• Reduces cramps and pain\n• Improves mood through endorphins\n• Helps with bloating\n\n**Best exercises:**\n• Light cardio (walking, swimming)\n• Yoga and stretching\n• Low-intensity strength training\n\nListen to your body and adjust intensity as needed."
      },
      'diet': {
        keywords: ['diet', 'food', 'nutrition', 'eat', 'cravings'],
        response: "Nutrition plays a key role in menstrual health:\n\n**Foods that help:**\n• Iron-rich foods (leafy greens, lean meat)\n• Calcium and magnesium (dairy, nuts)\n• Complex carbs (whole grains)\n• Omega-3 fatty acids (fish, flax seeds)\n\n**Limit:**\n• Excessive caffeine\n• High sodium foods\n• Refined sugars\n\nStay hydrated and eat regular, balanced meals."
      }
    };
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <button class="chatbot-toggle" id="chatbotToggle">
      </button>
      
      <div class="chatbot-container" id="chatbotContainer">
        <div class="chatbot-header">
          <div class="chatbot-title">
            Period Health Assistant
          </div>
          <button class="chatbot-close" id="chatbotClose">×</button>
        </div>
        
        <div class="chatbot-messages" id="chatbotMessages">
          <!-- Messages will be added here -->
        </div>
        
        <div class="chat-input-container">
          <input type="text" class="chat-input" id="chatInput" placeholder="Ask about period health..." maxlength="200">
          <button class="chat-send" id="chatSend">→</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  bindEvents() {
    document.getElementById('chatbotToggle').addEventListener('click', () => this.toggleChatbot());
    document.getElementById('chatbotClose').addEventListener('click', () => this.closeChatbot());
    document.getElementById('chatSend').addEventListener('click', () => this.sendMessage());
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  addWelcomeMessage() {
    const welcomeMsg = "Hi! I'm your Period Health Assistant 🩸\n\nI can help answer questions about:\n• Period pain and cramps\n• Cycle irregularities\n• Flow concerns\n• PMS symptoms\n• Exercise and nutrition\n\nFeel free to ask me anything or use the quick questions below!";
    this.addMessage('bot', welcomeMsg);
  }

  toggleChatbot() {
    this.isOpen = !this.isOpen;
    const container = document.getElementById('chatbotContainer');
    if (this.isOpen) {
      container.classList.add('show');
    } else {
      container.classList.remove('show');
    }
  }

  closeChatbot() {
    this.isOpen = false;
    document.getElementById('chatbotContainer').classList.remove('show');
  }

  sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    this.addMessage('user', message);
    input.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate AI response delay
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addMessage('bot', response);
    }, 1500);
  }

  addMessage(sender, message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageHTML = `
      <div class="chat-message ${sender}">
        <div class="chat-avatar ${sender}">
          ${sender === 'bot' ? '' : '👤'}
        </div>
        <div class="chat-bubble ${sender}">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingHTML = `
      <div class="chat-message bot" id="typingIndicator">
        <div class="chat-avatar bot"></div>
        <div class="chat-bubble bot">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 😊 I'm here to help with your period health questions. What would you like to know?";
    }
    
    // Check for thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! 💕 Feel free to ask if you have any other questions about your period health.";
    }
    
    // Find matching knowledge base entry
    for (const [topic, data] of Object.entries(this.knowledgeBase)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }
    
    // Default response for unmatched queries
    return "I understand you're asking about period health, but I might need more specific information to help you better.\n\nI can provide information about:\n• Period pain and cramps\n• Cycle length and irregularities\n• Flow concerns (heavy/light)\n• PMS symptoms\n• Exercise during periods\n• Nutrition for period health\n\n⚠️ Remember: I provide general information only. For serious concerns or medical advice, please consult a healthcare professional.";
  }
}

// Initialize chatbot when page loads
let chatbot;
document.addEventListener('DOMContentLoaded', function() {
  if (document.body.contains(document.querySelector('.dashboard'))) {
    chatbot = new PeriodHealthChatbot();
    chatbot.init();
  }
});
