// Global cursor and effects
const cursor = document.querySelector('.cursor');
const bgGif = document.getElementById('global-bg');

// Check authentication state
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const loginNav = document.getElementById('login-nav');
    const signupNav = document.getElementById('signup-nav');
    const dashboardNav = document.getElementById('dashboard-nav');
    const logoutNav = document.getElementById('logout-nav');

    if (currentUser) {
        if (loginNav) loginNav.classList.add('hidden');
        if (signupNav) signupNav.classList.add('hidden');
        if (dashboardNav) dashboardNav.classList.remove('hidden');
        if (logoutNav) logoutNav.classList.remove('hidden');
    } else {
        if (loginNav) loginNav.classList.remove('hidden');
        if (signupNav) signupNav.classList.remove('hidden');
        if (dashboardNav) dashboardNav.classList.add('hidden');
        if (logoutNav) logoutNav.classList.add('hidden');
    }
}

// Cursor effects
document.addEventListener('mousemove', e => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

document.addEventListener('mousedown', () => {
    if (cursor) cursor.classList.add('active');
});

document.addEventListener('mouseup', () => {
    if (cursor) cursor.classList.remove('active');
});

// Parallax background
document.addEventListener('mousemove', e => {
    if (bgGif && bgGif.src) {
        const x = (e.clientX / window.innerWidth - 0.5) * 22;
        const y = (e.clientY / window.innerHeight - 0.5) * 22;
        bgGif.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.15)`;
    }
});

// Typewriter effect
function typeWriterRepeat(el, txt, speed = 100, pause = 2000) {
    let i = 0, del = false;
    const type = () => {
        el.textContent = txt.substring(0, i);
        if (!del && i === txt.length) setTimeout(() => { del = true; type(); }, pause);
        else if (del && i === 0) { del = false; setTimeout(type, speed * 2); }
        else { i += del ? -1 : 1; setTimeout(type, del ? speed / 2 : speed); }
    };
    type();
}

// Landing page enter
function enterSite() {
    const landing = document.getElementById('landing');
    const content = document.getElementById('content');
    const mainFrame = document.querySelector('.main-frame');

    if (landing) {
        landing.classList.add('out');
        setTimeout(() => {
            landing.style.display = 'none';
            if (content) content.classList.remove('hidden');
            if (mainFrame) mainFrame.classList.add('in');
        }, 1300);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Set up logout functionality
    const logoutNav = document.getElementById('logout-nav');
    if (logoutNav) {
        logoutNav.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Set up landing page if it exists
    const landing = document.getElementById('landing');
    if (landing) {
        landing.addEventListener('click', enterSite);
        
        const landingTitle = document.getElementById('landing-title');
        const landingSubtitle = document.getElementById('landing-subtitle');
        
        if (landingTitle) typeWriterRepeat(landingTitle, "ENCODE", 140, 3400);
        if (landingSubtitle) {
            setTimeout(() => typeWriterRepeat(landingSubtitle, "click to enter the void", 90, 2700), 1200);
        }
    }

    // Load user background if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && bgGif) {
        const userData = localStorage.getItem(`user_${JSON.parse(currentUser).username}`);
        if (userData) {
            const profile = JSON.parse(userData);
            if (profile.background) {
                bgGif.src = profile.background;
            }
        }
    }
});
