document.addEventListener('DOMContentLoaded', function () {
    const authContainer = document.getElementById('auth-container');
    const mainApp = document.getElementById('main-app');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const toggleAuthBtn = document.getElementById('toggle-auth');
    const authMsg = document.getElementById('auth-msg');
    const logoutBtn = document.getElementById('logout-btn');

    let isLoginMode = true;

    checkAuthStatus();

    function checkAuthStatus() {
        const currentUser = sessionStorage.getItem('porto_current_user');
        if (currentUser) {
            authContainer.style.display = 'none';
            mainApp.style.display = 'block';
            
            setTimeout(() => {
                window.dispatchEvent(new Event('start-typing'));
                window.dispatchEvent(new Event('app-ready'));
            }, 500);

            const greetingElement = document.getElementById('greeting');
            if (greetingElement) {
                const hour = new Date().getHours();
                let timeGreeting = '';
                if (hour >= 5 && hour < 12) {
                    timeGreeting = 'Good morning';
                } else if (hour >= 12 && hour < 17) {
                    timeGreeting = 'Good afternoon';
                } else if (hour >= 17 && hour < 21) {
                    timeGreeting = 'Good evening';
                } else {
                    timeGreeting = 'Good night';
                }
                greetingElement.textContent = timeGreeting + ', ' + currentUser;
            }
        } else {
            authContainer.style.display = 'block';
            mainApp.style.display = 'none';
        }
    }

    if (toggleAuthBtn) {
        toggleAuthBtn.addEventListener('click', function (e) {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            authMsg.textContent = '';

            if (isLoginMode) {
                authTitle.textContent = 'SYSTEM_LOGIN';
                authSubmitBtn.textContent = 'EXECUTE_LOGIN';
                toggleAuthBtn.innerHTML = 'DON\'T HAVE ACCOUNT? <span>CREATE_ACCOUNT</span>';
            } else {
                authTitle.textContent = 'SYSTEM_REGISTER';
                authSubmitBtn.textContent = 'EXECUTE_REGISTER';
                toggleAuthBtn.innerHTML = 'ALREADY HAVE ACCOUNT? <span>LOGIN</span>';
            }
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const usernameInput = document.getElementById('auth-username').value.trim();
            const passwordInput = document.getElementById('auth-password').value.trim();

            if (!usernameInput || !passwordInput) {
                authMsg.style.color = '#ef4444';
                authMsg.textContent = 'Harap isi semua field.';
                return;
            }

            let users = [];
            try {
                const rawUsers = localStorage.getItem('porto_users');
                if (rawUsers) {
                    users = JSON.parse(rawUsers);
                    if (!Array.isArray(users)) users = [];
                }
            } catch (err) {
                console.error("Corrupted porto_users data, resetting.");
                users = [];
            }

            if (isLoginMode) {
                const user = users.find(u => u.username === usernameInput && u.password === passwordInput);
                if (user) {
                    window.dispatchEvent(new Event('access-granted'));
                    authMsg.style.color = '#22c55e';
                    authMsg.textContent = 'Login berhasil! Memuat profil...';

                    sessionStorage.setItem('porto_current_user', user.username);

                    setTimeout(() => {
                        authForm.reset();
                        authMsg.textContent = '';
                        checkAuthStatus();
                    }, 1000);
                } else {
                    authMsg.style.color = '#ef4444';
                    authMsg.textContent = 'Username atau password salah.';
                }
            } else {
                const userExists = users.some(u => u.username === usernameInput);
                if (userExists) {
                    authMsg.style.color = '#ef4444';
                    authMsg.textContent = 'Username sudah digunakan. Silakan pilih yang lain.';
                } else {
                    users.push({
                        username: usernameInput,
                        password: passwordInput,
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('porto_users', JSON.stringify(users));

                    authMsg.style.color = '#22c55e';
                    authMsg.textContent = 'Pendaftaran berhasil! Silakan login.';

                    setTimeout(() => {
                        authForm.reset();
                        authMsg.textContent = '';
                        toggleAuthBtn.click();
                    }, 1500);
                }
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('Yakin ingin logout?')) {
                sessionStorage.removeItem('porto_current_user');
                window.dispatchEvent(new Event('app-logout'));
                checkAuthStatus();
            }
        });
    }
});
