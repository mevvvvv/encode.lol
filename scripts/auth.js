// Authentication functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authMessage = document.getElementById('auth-message');

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage('Invalid username or password', 'error');
            }
        });
    }

    // Signup form handler
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validation
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            if (username.length < 3) {
                showMessage('Username must be at least 3 characters', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }

            // Check if username exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.username === username)) {
                showMessage('Username already exists', 'error');
                return;
            }

            // Create new user
            const newUser = { username, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            showMessage('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    function showMessage(message, type) {
        if (authMessage) {
            authMessage.textContent = message;
            authMessage.className = `auth-message ${type}`;
            authMessage.classList.remove('hidden');
            
            setTimeout(() => {
                authMessage.classList.add('hidden');
            }, 3000);
        }
    }

    // Redirect if already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && (window.location.pathname.includes('login.html') || 
                        window.location.pathname.includes('signup.html'))) {
        window.location.href = 'dashboard.html';
    }
});
