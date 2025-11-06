// Profile management functionality
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        if (!window.location.pathname.includes('user.html')) {
            window.location.href = 'login.html';
        }
        return;
    }

    const user = JSON.parse(currentUser);
    
    // Dashboard functionality
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard(user);
    }
    
    // Profile page functionality
    if (window.location.pathname.includes('user.html')) {
        initializeProfilePage();
    }
});

function initializeDashboard(user) {
    const currentUserSpan = document.getElementById('current-user');
    const profileUsername = document.getElementById('profile-username');
    const profileForm = document.getElementById('profile-form');
    
    if (currentUserSpan) currentUserSpan.textContent = user.username;
    if (profileUsername) profileUsername.textContent = user.username;

    // Load existing profile data
    const userData = localStorage.getItem(`user_${user.username}`);
    if (userData) {
        const profile = JSON.parse(userData);
        loadProfileData(profile);
    }

    // File upload handlers
    setupFileUpload('profile-picture', 'pfp-preview');
    setupFileUpload('background-media', 'bg-preview');
    setupFileUpload('profile-audio', 'audio-preview', true);

    // Form submission
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfile(user.username);
        });
    }

    // Initialize main frame
    const mainFrame = document.querySelector('.main-frame');
    if (mainFrame) {
        setTimeout(() => {
            mainFrame.classList.add('in');
        }, 100);
    }
}

function initializeProfilePage() {
    // Get username from URL or use current user
    const urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('user');
    
    if (!username) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            username = JSON.parse(currentUser).username;
        }
    }

    if (username) {
        loadUserProfile(username);
    } else {
        document.body.innerHTML = '<div class="error">User not found</div>';
    }
}

function setupFileUpload(inputId, previewId, isAudio = false) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (input && preview) {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (isAudio) {
                        preview.src = e.target.result;
                    } else {
                        preview.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function loadProfileData(profile) {
    // Load profile picture
    if (profile.profilePicture && document.getElementById('pfp-preview')) {
        document.getElementById('pfp-preview').src = profile.profilePicture;
    }
    
    // Load background
    if (profile.background && document.getElementById('bg-preview')) {
        document.getElementById('bg-preview').src = profile.background;
    }
    
    // Load audio
    if (profile.audio && document.getElementById('audio-preview')) {
        document.getElementById('audio-preview').src = profile.audio;
    }
    
    // Load display name and bio
    if (profile.displayName && document.getElementById('display-name')) {
        document.getElementById('display-name').value = profile.displayName;
    }
    
    if (profile.bio && document.getElementById('bio')) {
        document.getElementById('bio').value = profile.bio;
    }
}

function saveProfile(username) {
    const profileData = {
        profilePicture: document.getElementById('pfp-preview').src || '',
        background: document.getElementById('bg-preview').src || '',
        audio: document.getElementById('audio-preview').src || '',
        displayName: document.getElementById('display-name').value || username,
        bio: document.getElementById('bio').value || ''
    };

    localStorage.setItem(`user_${username}`, JSON.stringify(profileData));
    
    // Show success message
    alert('Profile saved successfully!');
}

function loadUserProfile(username) {
    const userData = localStorage.getItem(`user_${username}`);
    
    if (!userData) {
        document.body.innerHTML = '<div class="error">User profile not found</div>';
        return;
    }

    const profile = JSON.parse(userData);
    
    // Set page title
    document.getElementById('profile-title').textContent = `${profile.displayName || username} - Encode`;
    
    // Set profile elements
    if (profile.profilePicture) {
        document.getElementById('profile-picture').src = profile.profilePicture;
    }
    
    if (profile.background) {
        document.getElementById('profile-bg').src = profile.background;
    }
    
    if (profile.displayName) {
        document.getElementById('profile-display-name').textContent = profile.displayName;
    } else {
        document.getElementById('profile-display-name').textContent = username;
    }
    
    if (profile.bio) {
        document.getElementById('profile-bio').textContent = profile.bio;
    }
    
    if (profile.audio) {
        document.getElementById('profile-audio').src = profile.audio;
        setupAudioPlayer();
    }

    // Set up landing page text
    const landingTitle = document.getElementById('landing-title');
    const landingSubtitle = document.getElementById('landing-subtitle');
    
    if (landingTitle) {
        landingTitle.textContent = profile.displayName || username;
    }
}

function enterProfile() {
    const landing = document.getElementById('landing');
    const profileContent = document.getElementById('profile-content');
    const audioPlayer = document.getElementById('audio-player');
    const profileFrame = document.getElementById('profile-frame');

    if (landing) {
        landing.classList.add('out');
        setTimeout(() => {
            landing.style.display = 'none';
            if (profileContent) profileContent.classList.remove('hidden');
            if (audioPlayer) audioPlayer.classList.add('show');
            if (profileFrame) profileFrame.classList.add('in');
            
            // Start audio if available
            const audio = document.getElementById('profile-audio');
            if (audio && audio.src) {
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        }, 1300);
    }
}

function setupAudioPlayer() {
    const audio = document.getElementById('profile-audio');
    const playBtn = document.getElementById('play-btn');
    const progress = document.getElementById('progress');
    const volumeSlider = document.getElementById('volume-slider');

    if (audio && playBtn) {
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = 'Pause';
            } else {
                audio.pause();
                playBtn.textContent = 'Play';
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (progress) {
                progress.style.width = (audio.currentTime / audio.duration * 100 || 0) + '%';
            }
        });

        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                audio.volume = volumeSlider.value;
            });
        }
    }
}
