// SplitPay Application JavaScript

// Application Data
let appData = {
  currentUser: null,
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+919876543210",
      walletBalance: 5000,
      paymentPassword: "1234"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+919876543211",
      walletBalance: 3500,
      paymentPassword: "5678"
    }
  ],
  groups: [
    {
      id: 1,
      name: "Roommates",
      members: ["John Doe", "Jane Smith", "Mike Johnson"],
      expenses: [
        { id: 1, description: "Groceries", amount: 1200, paidBy: "John Doe", date: "2025-08-25" },
        { id: 2, description: "Electricity Bill", amount: 800, paidBy: "Jane Smith", date: "2025-08-24" }
      ]
    },
    {
      id: 2,
      name: "Trip to Goa",
      members: ["John Doe", "Alice Brown", "Bob Wilson"],
      expenses: [
        { id: 3, description: "Hotel Booking", amount: 6000, paidBy: "John Doe", date: "2025-08-23" },
        { id: 4, description: "Food & Drinks", amount: 2400, paidBy: "Alice Brown", date: "2025-08-22" }
      ]
    }
  ],
  transactions: [
    { id: 1, type: "payment", description: "UPI Payment to Merchant", amount: -150, date: "2025-08-29", status: "completed" },
    { id: 2, type: "received", description: "Money added from Bank", amount: 2000, date: "2025-08-28", status: "completed" },
    { id: 3, type: "payment", description: "Split payment to Jane", amount: -400, date: "2025-08-27", status: "completed" }
  ],
  paymentMethods: [
    { id: 1, type: "wallet", name: "Wallet Balance" },
    { id: 2, type: "upi", name: "UPI Payment" },
    { id: 3, type: "bank", name: "Bank Account" }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  console.log('Initializing app...');
  // Always start with auth section for demo
  showAuthSection();
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Auth tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      switchAuthTab(this.dataset.tab);
    });
  });

  // Auth forms
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Login button clicked');
      handleLogin();
    });
  }
  
  if (signupBtn) {
    signupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleSignup();
    });
  }
  
  // OTP verification
  const otpVerify = document.getElementById('otp-verify');
  const otpCancel = document.getElementById('otp-cancel');
  if (otpVerify) otpVerify.addEventListener('click', handleOTPVerification);
  if (otpCancel) otpCancel.addEventListener('click', () => hideModal('otp-modal'));
  
  // Payment password setup
  const setPaymentPassword = document.getElementById('set-payment-password');
  if (setPaymentPassword) {
    setPaymentPassword.addEventListener('click', handleSetPaymentPassword);
  }
  
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      switchPage(this.dataset.page);
    });
  });
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  }
  
  // Quick actions - using more defensive approach
  const quickActionButtons = [
    { id: 'add-money-btn', action: () => showModal('add-money-modal') },
    { id: 'add-money-wallet-btn', action: () => showModal('add-money-modal') },
    { id: 'create-group-btn', action: () => showModal('group-modal') },
    { id: 'new-group-btn', action: () => showModal('group-modal') },
    { id: 'scan-qr-btn', action: () => showModal('qr-scanner-modal') },
    { id: 'pay-bill-btn', action: () => showModal('qr-scanner-modal') },
    { id: 'send-money-btn', action: () => handleSendMoney() }
  ];
  
  quickActionButtons.forEach(({ id, action }) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        action();
      });
    }
  });
  
  // Modal handlers
  const modalButtons = [
    { id: 'qr-pay', action: handleQRPayment },
    { id: 'qr-cancel', action: () => hideModal('qr-scanner-modal') },
    { id: 'payment-confirm', action: handlePaymentConfirmation },
    { id: 'payment-cancel', action: () => hideModal('payment-modal') },
    { id: 'group-create', action: handleGroupCreation },
    { id: 'group-cancel', action: () => hideModal('group-modal') },
    { id: 'add-money-confirm', action: handleAddMoney },
    { id: 'add-money-cancel', action: () => hideModal('add-money-modal') }
  ];
  
  modalButtons.forEach(({ id, action }) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        action();
      });
    }
  });
  
  // Transaction filter
  const transactionFilter = document.getElementById('transaction-filter');
  if (transactionFilter) {
    transactionFilter.addEventListener('change', function() {
      filterTransactions(this.value);
    });
  }
  
  // OTP input handling
  setupOTPInputs();
}

function switchAuthTab(tab) {
  console.log('Switching to tab:', tab);
  // Remove active class from all tabs and forms
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  
  // Add active class to selected tab and form
  const activeTab = document.querySelector(`[data-tab="${tab}"]`);
  const activeForm = document.getElementById(`${tab}-form`);
  
  if (activeTab) activeTab.classList.add('active');
  if (activeForm) activeForm.classList.add('active');
}

function handleLogin() {
  console.log('handleLogin called');
  
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  
  if (!emailInput || !passwordInput) {
    console.error('Login form elements not found');
    showNotification('Login form error', 'error');
    return;
  }
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  console.log('Attempting login with:', email, password);
  
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Find user - for demo, accept "password" as valid password for john@example.com
  const user = appData.users.find(u => (u.email === email || u.phone === email));
  
  if (user && password === 'password') {
    console.log('Login successful, user found:', user);
    appData.currentUser = user;
    showNotification('Login successful!');
    
    // Immediate transition to main app
    showMainApp();
  } else {
    console.log('Login failed - invalid credentials');
    showNotification('Invalid credentials. Use: john@example.com / password', 'error');
  }
}

function handleSignup() {
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const phoneInput = document.getElementById('signup-phone');
  const passwordInput = document.getElementById('signup-password');
  
  if (!nameInput || !emailInput || !phoneInput || !passwordInput) {
    showNotification('Signup form error', 'error');
    return;
  }
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!name || !email || !phone || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Basic email validation
  if (!email.includes('@')) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  // Check if user exists
  const existingUser = appData.users.find(u => u.email === email || u.phone === phone);
  if (existingUser) {
    showNotification('User already exists', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: appData.users.length + 1,
    name,
    email,
    phone,
    walletBalance: 0,
    paymentPassword: null
  };
  
  appData.users.push(newUser);
  appData.currentUser = newUser;
  
  showNotification('Verification code sent to your phone/email!');
  setTimeout(() => {
    showModal('otp-modal');
  }, 1000);
}

function setupOTPInputs() {
  const otpInputs = document.querySelectorAll('.otp-input');
  
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
      if (this.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && !this.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
}

function handleOTPVerification() {
  const otpInputs = document.querySelectorAll('.otp-input');
  const otp = Array.from(otpInputs).map(input => input.value).join('');
  
  if (otp.length !== 6) {
    showNotification('Please enter complete OTP', 'error');
    return;
  }
  
  // Simulate OTP verification (accept any 6-digit code for demo)
  hideModal('otp-modal');
  showNotification('Account verified successfully!');
  
  // Clear OTP inputs
  otpInputs.forEach(input => input.value = '');
  
  setTimeout(() => {
    showModal('payment-password-modal');
  }, 1000);
}

function handleSetPaymentPassword() {
  const passwordInput = document.getElementById('payment-password');
  const confirmPasswordInput = document.getElementById('confirm-payment-password');
  
  if (!passwordInput || !confirmPasswordInput) {
    showNotification('Password form error', 'error');
    return;
  }
  
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (!password || !confirmPassword) {
    showNotification('Please fill in both fields', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  if (password.length < 4) {
    showNotification('Password must be at least 4 digits', 'error');
    return;
  }
  
  appData.currentUser.paymentPassword = password;
  
  hideModal('payment-password-modal');
  showNotification('Payment password set successfully!');
  
  setTimeout(() => {
    showMainApp();
  }, 1000);
}

function showAuthSection() {
  console.log('showAuthSection called');
  const authSection = document.getElementById('auth-section');
  const mainApp = document.getElementById('main-app');
  
  if (authSection && mainApp) {
    authSection.classList.remove('hidden');
    mainApp.classList.add('hidden');
    console.log('Auth section shown, main app hidden');
  } else {
    console.error('Auth section or main app not found');
  }
}

function showMainApp() {
  console.log('showMainApp called');
  const authSection = document.getElementById('auth-section');
  const mainApp = document.getElementById('main-app');
  
  if (!authSection || !mainApp) {
    console.error('Required DOM elements not found:', { authSection: !!authSection, mainApp: !!mainApp });
    return;
  }
  
  console.log('Transitioning to main app...');
  authSection.classList.add('hidden');
  mainApp.classList.remove('hidden');
  
  // Initialize main app content
  setTimeout(() => {
    updateDashboard();
    updateWalletBalance();
    renderRecentTransactions();
    renderGroups();
    renderTransactions();
    renderPaymentMethods();
    updateProfile();
    console.log('Main app initialized');
  }, 100);
}

function updateDashboard() {
  const welcomeMessage = document.getElementById('welcome-message');
  const walletBalance = document.getElementById('wallet-balance');
  
  if (welcomeMessage && appData.currentUser) {
    welcomeMessage.textContent = `Welcome back, ${appData.currentUser.name}!`;
  }
  
  if (walletBalance && appData.currentUser) {
    walletBalance.textContent = `₹${appData.currentUser.walletBalance.toLocaleString()}`;
  }
}

function updateWalletBalance() {
  const walletBalanceLarge = document.getElementById('wallet-balance-large');
  if (walletBalanceLarge && appData.currentUser) {
    walletBalanceLarge.textContent = `₹${appData.currentUser.walletBalance.toLocaleString()}`;
  }
}

function renderRecentTransactions() {
  const container = document.getElementById('recent-transactions-list');
  if (!container) return;
  
  const recentTransactions = appData.transactions.slice(-5).reverse();
  
  if (recentTransactions.length === 0) {
    container.innerHTML = '<div class="empty-state">No transactions yet</div>';
    return;
  }
  
  container.innerHTML = recentTransactions.map(transaction => `
    <div class="transaction-item">
      <div class="transaction-info">
        <h4>${transaction.description}</h4>
        <p>
          <span class="status-indicator status-${transaction.status}"></span>
          ${formatDate(transaction.date)}
        </p>
      </div>
      <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
        ${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
      </div>
    </div>
  `).join('');
}

function renderGroups() {
  const container = document.getElementById('groups-list');
  if (!container) return;
  
  const userGroups = appData.groups.filter(group => 
    appData.currentUser && group.members.includes(appData.currentUser.name)
  );
  
  if (userGroups.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>No groups yet. Create your first group!</p></div>';
    return;
  }
  
  container.innerHTML = userGroups.map(group => {
    const totalExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const memberCount = group.members.length;
    const perPersonShare = totalExpenses / memberCount;
    
    return `
      <div class="group-card">
        <div class="group-header">
          <h3>${group.name}</h3>
          <span class="status status--info">${memberCount} members</span>
        </div>
        <p>Recent activity: ${group.expenses.length} expenses</p>
        <div class="group-stats">
          <div class="group-stat">
            <div class="group-stat-value">₹${totalExpenses.toLocaleString()}</div>
            <div class="group-stat-label">Total spent</div>
          </div>
          <div class="group-stat">
            <div class="group-stat-value">₹${Math.round(perPersonShare).toLocaleString()}</div>
            <div class="group-stat-label">Per person</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTransactions() {
  const container = document.getElementById('transactions-list');
  if (!container) return;
  
  if (appData.transactions.length === 0) {
    container.innerHTML = '<div class="empty-state">No transactions found</div>';
    return;
  }
  
  container.innerHTML = appData.transactions.map(transaction => `
    <div class="transaction-item">
      <div class="transaction-info">
        <h4>${transaction.description}</h4>
        <p>
          <span class="status-indicator status-${transaction.status}"></span>
          ${formatDate(transaction.date)} • ${transaction.type}
        </p>
      </div>
      <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
        ${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
      </div>
    </div>
  `).join('');
}

function renderPaymentMethods() {
  const container = document.getElementById('payment-methods-list');
  if (!container) return;
  
  container.innerHTML = appData.paymentMethods.map(method => `
    <div class="payment-method-item">
      <span>${method.name}</span>
      <span class="status status--success">Active</span>
    </div>
  `).join('');
}

function updateProfile() {
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profilePhone = document.getElementById('profile-phone');
  
  if (profileName && appData.currentUser) profileName.textContent = appData.currentUser.name;
  if (profileEmail && appData.currentUser) profileEmail.textContent = appData.currentUser.email;
  if (profilePhone && appData.currentUser) profilePhone.textContent = appData.currentUser.phone;
}

function switchPage(pageId) {
  console.log('Switching to page:', pageId);
  
  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeNavItem = document.querySelector(`[data-page="${pageId}"]`);
  if (activeNavItem) activeNavItem.classList.add('active');
  
  // Update pages
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const activePage = document.getElementById(`${pageId}-page`);
  if (activePage) activePage.classList.add('active');
  
  // Refresh data for specific pages
  if (pageId === 'groups') {
    renderGroups();
  } else if (pageId === 'transactions') {
    renderTransactions();
  } else if (pageId === 'wallet') {
    updateWalletBalance();
    renderPaymentMethods();
  }
}

function handleQRPayment() {
  const amountInput = document.getElementById('qr-amount');
  if (!amountInput) return;
  
  const amount = amountInput.value;
  
  if (!amount || amount <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }
  
  hideModal('qr-scanner-modal');
  
  // Set up payment modal
  const paymentAmountEl = document.getElementById('payment-amount');
  const paymentRecipientEl = document.getElementById('payment-recipient');
  
  if (paymentAmountEl) paymentAmountEl.textContent = `₹${amount}`;
  if (paymentRecipientEl) paymentRecipientEl.textContent = 'Merchant (QR Code)';
  
  showModal('payment-modal');
}

function handlePaymentConfirmation() {
  const paymentAmountEl = document.getElementById('payment-amount');
  const paymentMethodEl = document.getElementById('payment-method');
  const paymentPasswordEl = document.getElementById('confirm-payment-pwd');
  const paymentRecipientEl = document.getElementById('payment-recipient');
  
  if (!paymentAmountEl || !paymentMethodEl || !paymentPasswordEl || !paymentRecipientEl) {
    showNotification('Payment form error', 'error');
    return;
  }
  
  const amount = parseFloat(paymentAmountEl.textContent.replace('₹', '').replace(',', ''));
  const paymentMethod = paymentMethodEl.value;
  const paymentPassword = paymentPasswordEl.value;
  
  if (!paymentPassword) {
    showNotification('Please enter payment password', 'error');
    return;
  }
  
  if (paymentPassword !== appData.currentUser.paymentPassword) {
    showNotification('Invalid payment password', 'error');
    return;
  }
  
  if (paymentMethod === 'wallet' && appData.currentUser.walletBalance < amount) {
    showNotification('Insufficient wallet balance', 'error');
    return;
  }
  
  // Process payment
  if (paymentMethod === 'wallet') {
    appData.currentUser.walletBalance -= amount;
  }
  
  // Add transaction
  const newTransaction = {
    id: appData.transactions.length + 1,
    type: 'payment',
    description: `Payment to ${paymentRecipientEl.textContent}`,
    amount: -amount,
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  };
  
  appData.transactions.unshift(newTransaction);
  
  // Update UI
  updateDashboard();
  updateWalletBalance();
  renderRecentTransactions();
  renderTransactions();
  
  // Clear form and hide modal
  paymentPasswordEl.value = '';
  hideModal('payment-modal');
  
  showNotification(`Payment of ₹${amount} successful!`);
}

function handleGroupCreation() {
  const groupNameInput = document.getElementById('group-name');
  const groupMembersInput = document.getElementById('group-members');
  
  if (!groupNameInput) {
    showNotification('Group form error', 'error');
    return;
  }
  
  const groupName = groupNameInput.value.trim();
  const membersInput = groupMembersInput ? groupMembersInput.value.trim() : '';
  
  if (!groupName) {
    showNotification('Please enter group name', 'error');
    return;
  }
  
  const members = [appData.currentUser.name];
  if (membersInput) {
    const additionalMembers = membersInput.split(',').map(m => m.trim()).filter(m => m);
    members.push(...additionalMembers);
  }
  
  const newGroup = {
    id: appData.groups.length + 1,
    name: groupName,
    members: members,
    expenses: []
  };
  
  appData.groups.push(newGroup);
  
  // Clear form and hide modal
  groupNameInput.value = '';
  if (groupMembersInput) groupMembersInput.value = '';
  hideModal('group-modal');
  
  renderGroups();
  showNotification(`Group "${groupName}" created successfully!`);
}

function handleAddMoney() {
  const amountInput = document.getElementById('add-money-amount');
  const sourceInput = document.getElementById('add-money-source');
  
  if (!amountInput) {
    showNotification('Add money form error', 'error');
    return;
  }
  
  const amount = parseFloat(amountInput.value);
  const source = sourceInput ? sourceInput.value : 'bank';
  
  if (!amount || amount <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }
  
  // Add money to wallet
  appData.currentUser.walletBalance += amount;
  
  // Add transaction
  const newTransaction = {
    id: appData.transactions.length + 1,
    type: 'received',
    description: `Money added from ${source === 'bank' ? 'Bank Account' : 'Debit Card'}`,
    amount: amount,
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  };
  
  appData.transactions.unshift(newTransaction);
  
  // Update UI
  updateDashboard();
  updateWalletBalance();
  renderRecentTransactions();
  renderTransactions();
  
  // Clear form and hide modal
  amountInput.value = '';
  hideModal('add-money-modal');
  
  showNotification(`₹${amount} added to wallet successfully!`);
}

function handleSendMoney() {
  const recipient = prompt('Enter recipient email or phone:');
  if (!recipient) return;
  
  const amount = prompt('Enter amount to send:');
  if (!amount || parseFloat(amount) <= 0) return;
  
  const amountNum = parseFloat(amount);
  
  if (appData.currentUser.walletBalance >= amountNum) {
    appData.currentUser.walletBalance -= amountNum;
    
    const newTransaction = {
      id: appData.transactions.length + 1,
      type: 'payment',
      description: `Money sent to ${recipient}`,
      amount: -amountNum,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    appData.transactions.unshift(newTransaction);
    
    updateDashboard();
    updateWalletBalance();
    renderRecentTransactions();
    renderTransactions();
    
    showNotification(`₹${amount} sent to ${recipient} successfully!`);
  } else {
    showNotification('Insufficient wallet balance', 'error');
  }
}

function handleLogout() {
  appData.currentUser = null;
  showAuthSection();
  
  // Reset forms
  document.querySelectorAll('input').forEach(input => {
    if (input.type !== 'button' && input.type !== 'submit') {
      input.value = '';
    }
  });
  
  // Reset to dashboard and login tab
  switchPage('dashboard');
  switchAuthTab('login');
  
  showNotification('Logged out successfully!');
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    
    // Focus first input if available
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showNotification(message, type = 'success') {
  const notificationEl = document.getElementById('notification');
  const messageEl = document.getElementById('notification-message');
  
  if (notificationEl && messageEl) {
    messageEl.textContent = message;
    notificationEl.className = `notification ${type}`;
    
    // Show notification
    notificationEl.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notificationEl.classList.add('hidden');
    }, 3000);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function filterTransactions(filterType) {
  let filteredTransactions = appData.transactions;
  
  if (filterType !== 'all') {
    filteredTransactions = appData.transactions.filter(transaction => {
      if (filterType === 'payment') return transaction.amount < 0;
      if (filterType === 'received') return transaction.amount > 0;
      if (filterType === 'group') return transaction.description.toLowerCase().includes('group') || transaction.description.toLowerCase().includes('split');
      return true;
    });
  }
  
  const container = document.getElementById('transactions-list');
  if (!container) return;
  
  if (filteredTransactions.length === 0) {
    container.innerHTML = '<div class="empty-state">No transactions found for this filter</div>';
    return;
  }
  
  container.innerHTML = filteredTransactions.map(transaction => `
    <div class="transaction-item">
      <div class="transaction-info">
        <h4>${transaction.description}</h4>
        <p>
          <span class="status-indicator status-${transaction.status}"></span>
          ${formatDate(transaction.date)} • ${transaction.type}
        </p>
      </div>
      <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
        ${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}
      </div>
    </div>
  `).join('');
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.add('hidden');
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
      modal.classList.add('hidden');
    });
  }
});