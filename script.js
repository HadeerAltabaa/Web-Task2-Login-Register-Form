// User data storage
const USER_DATA_KEY = 'userData';

// DOM Elements
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const modal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.querySelector('.close');
const welcomePage = document.getElementById('welcomePage');
const welcomeUsername = document.getElementById('welcomeUsername');
const displayUsername = document.getElementById('displayUsername');
const displayPhone = document.getElementById('displayPhone');
const displayEmail = document.getElementById('displayEmail');
const logoutBtn = document.querySelector('.logout-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Toggle between forms
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Modal handling 
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

function showMessage(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// Initializing user data if not exists
function initUserData() {
    if (!localStorage.getItem(USER_DATA_KEY)) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify([]));
    }
}

// Validate Saudi phone numbers
function isValidSaudiPhone (phone) {
    const saudiPhoneRegex = /^05\d{8}$/;
    return saudiPhoneRegex.test(phone);
}

// Save user data
function saveUserData(user) {
    const users = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    users.push(user);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(users));
}

// Check if username exists
function usernameExists(username) {
    const users = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    return users.some(user => user.username === username);
}

function userEmailExists(email) {
    const users = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    return users.some(user => user.email === email);
}

// Validate password strength
function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_\/-])[A-Za-z\d@_\/-]{8,}$/;
    return strongPasswordRegex.test(password);
}

// Validate login
function validateLogin(username, password) {
    const users = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    const user = users.find(user => user.username === username);
    
    if (!user) {
        return {success: false, message: 'Username does not found.'};
    } 
    
    if (user.password !== password) {
        return {success: false, message: 'Incorrect password.'};
    }

    showWelcomePage(user);
    return {success: true, message: 'Login successful!'};
}

// function to show welcome page
function showWelcomePage(user) {
    welcomeUsername.textContent = user.username;
    displayUsername.textContent = user.username;
    displayPhone.textContent = user.phone;
    displayEmail.textContent = user.email;

    // Hide other pages
    container.style.display = 'none';
    modal.style.display = 'none';

    // Show welcome page
    welcomePage.style.display = 'flex';
}

// Handle logout function
function logout() {
    welcomePage.style.display = 'none';
    container.style.display = 'block';
    container.classList.remove('active');

    loginForm.reset();
    registerForm.reset();
}

// Form submissions
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const user = {
        username: formData.get('username'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    if (usernameExists(user.username)) {
        showMessage('Username already exists.');
    } else if (userEmailExists(user.email)) {
        showMessage('Email already exists.');
    } else if (!isValidSaudiPhone(user.phone)) {
        showMessage('Invalid Saudi phone number. It should start with 05 and be 10 digists long (e.g., 0512345678');
    } else if (!isStrongPassword(user.password)) {
        showMessage('Password must be at least 8 characters long and contain letters, numbers, and special characters (@, _, /, -). Example:Pass@123');
    } else {
        saveUserData(user);
        showWelcomePage(user);
        //showMessage('Registration successful! You can now log in.');
        registerForm.reset();
        //container.classList.remove('active');
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    const result = validateLogin(username, password);
    //showMessage(result.message);
    
    /*if (result.success) {
        loginForm.reset();
    }*/

    if (!result.success) {
        showMessage(result.message);
    } else {
        loginForm.reset();
    }
});

logoutBtn.addEventListener('click', logout);

// Initialize on page load
initUserData();