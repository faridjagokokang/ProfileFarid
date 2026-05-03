document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initHoverEffects();
    initResponsiveFeatures();
});


function initScrollAnimations() {
    const cards = document.querySelectorAll('.card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function initHoverEffects() {
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        profilePhoto.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) translateY(0)';
        });
    }

    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.02)';
        });
        row.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

function initResponsiveFeatures() {
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);

    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting = '';
        if (hour >= 5 && hour < 12) {
            greeting = 'Good morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good evening';
        } else {
            greeting = 'Good night';
        }
        greetingElement.textContent = greeting;
    }

    const roles = ['Saya dikenal sebagai pribadi yang disiplin, bertanggung jawab, dan selalu antusias untuk belajar hal baru terutama di bidang teknologi.', 'Saya memiliki pengalaman dalam berbagai proyek teknologi, mulai dari pengembangan web hingga pemrograman aplikasi.'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingTextElement = document.getElementById('typing-text');
    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            charIndex--;
            typingTextElement.innerHTML = currentRole.slice(0, charIndex) + '<span class="cursor"></span>';
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, 100);
            }
        } else {
            charIndex++;
            typingTextElement.innerHTML = currentRole.slice(0, charIndex) + '<span class="cursor"></span>';
            if (charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(type, 1800);
            } else {
                setTimeout(type, 100);
            }
        }
    }

    const birthdate = "2006-02-07";
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthdate).getFullYear();
    const age = currentYear - birthYear;
    const ageDisplayElement = document.getElementById('age-display');
    if (ageDisplayElement) {
        ageDisplayElement.textContent = `Saya berusia ${age} tahun`;
    }
    type();

    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            this.textContent = newTheme === 'dark' ? 'Switch to ☀️' : 'Switch to 🌙';
        });
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const target = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const phoneInput = this.querySelector('input[name="phone"]');
            const countryCodeInput = this.querySelector('select[name="country_code"]');
            const messageInput = this.querySelector('textarea[name="questions"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            let phone = '';
            let countryCode = '';

            if (phoneInput && countryCodeInput) {
                phone = phoneInput.value.trim();
                countryCode = countryCodeInput.value;
            }

            let isValid = true;
            if (name.length < 2) {
                isValid = false;
                nameInput.classList.add('error');
                document.getElementById('err-name').textContent = 'Name must be at least 2 characters.';
            } else {
                nameInput.classList.remove('error');
                document.getElementById('err-name').textContent = '';
            }

            if (!email.includes('@') || !email.includes('.')) {
                isValid = false;
                emailInput.classList.add('error');
                document.getElementById('err-email').textContent = 'Please enter a valid email.';
            } else {
                emailInput.classList.remove('error');
                document.getElementById('err-email').textContent = '';
            }

            if (message.length < 10) {
                isValid = false;
                messageInput.classList.add('error');
                document.getElementById('err-questions').textContent = 'Message must be at least 10 characters.';
            } else {
                messageInput.classList.remove('error');
                document.getElementById('err-questions').textContent = '';
            }

            if (isValid) {
                let messages = JSON.parse(localStorage.getItem('porto_messages')) || [];
                messages.push({
                    name: name,
                    email: email,
                    phone: countryCode + phone,
                    message: message,
                    date: new Date().toISOString()
                });
                localStorage.setItem('porto_messages', JSON.stringify(messages));

                document.getElementById('form-success').textContent = 'Mengalihkan ke WhatsApp...';

                const waNumber = '6287755466436';
                const waText = `Halo Novant! Saya ${name}.\nEmail: ${email}\nNo. HP: ${countryCode}${phone}\n\nPesan:\n${message}`;
                const encodedText = encodeURIComponent(waText);
                setTimeout(() => {
                    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
                    this.reset();
                    document.getElementById('form-success').textContent = '';
                }, 1000);
            }
        });
    }

    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserverOptions = {
        threshold: 0.3
    };
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const level = skillItem.getAttribute('data-level');
                const fill = skillItem.querySelector('.skill-fill');
                setTimeout(() => {
                    fill.style.width = level + '%';
                }, 200);
                skillObserver.unobserve(skillItem);
            }
        });
    }, skillObserverOptions);

    skillItems.forEach(item => {
        const fill = item.querySelector('.skill-fill');
        fill.style.width = '0%';
        skillObserver.observe(item);
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

}