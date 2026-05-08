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
        
        // Gyroscope 3D Tilt for Mobile
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                const tiltX = e.gamma; // left-to-right (-90 to 90)
                const tiltY = e.beta;  // front-to-back (-180 to 180)
                
                // Limit the tilt values to avoid extreme rotations
                const constrainedX = Math.max(-30, Math.min(30, tiltX));
                const constrainedY = Math.max(-30, Math.min(30, tiltY - 45)); // assume holding phone at 45deg
                
                const rotationY = (constrainedX / 30) * 15; // max 15deg rotation
                const rotationX = -(constrainedY / 30) * 15;
                
                document.querySelectorAll('.card, .auth-card').forEach(card => {
                    card.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale3d(1, 1, 1)`;
                    card.style.transition = 'transform 0.1s ease-out';
                });
            });
        }
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
    
    // Play sound helper
    function playTypeSound() {
        if (!window.audioCtx) return;
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(window.audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(400 + Math.random() * 200, window.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.01, window.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, window.audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(window.audioCtx.currentTime + 0.05);
    }

    if (ageDisplayElement) {
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !ageDisplayElement.dataset.typed) {
                    ageDisplayElement.dataset.typed = 'true';
                    const baseText = `Saya berusia ${age} tahun dan tinggal di Kabupaten Cilacap, Kecamatan Kesugihan. Saat ini saya tengah menempuh pendidikan di Program Studi Informatika dan memiliki minat besar pada dunia teknologi serta programming.`;
                    ageDisplayElement.textContent = '';
                    let i = 0;
                    function typeAge() {
                        if (i < baseText.length) {
                            ageDisplayElement.textContent += baseText.charAt(i);
                            if (i % 2 === 0) playTypeSound(); // Play sound every 2 characters
                            i++;
                            setTimeout(typeAge, 35);
                        }
                    }
                    setTimeout(typeAge, 500); // slight delay after scroll
                }
            });
        }, { threshold: 0.5 });
        
        typingObserver.observe(ageDisplayElement);
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

    const navArticlesBtn = document.getElementById('nav-articles-btn');
    if (navArticlesBtn) {
        navArticlesBtn.addEventListener('click', function () {
            const articlesSection = document.getElementById('articles-section');
            if (articlesSection) {
                articlesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

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

    // 1. Download CV Button Logic
    const btnDownloadCv = document.getElementById('btn-download-cv');
    if (btnDownloadCv) {
        btnDownloadCv.addEventListener('click', function () {
            const originalText = this.innerText;
            this.innerText = '[DECRYPTING_FILE...]';
            setTimeout(() => {
                this.innerText = '[DOWNLOADING...]';
                setTimeout(() => {
                    this.innerText = '[FILE_SAVED]';
                    const blob = new Blob(["Resume Data:\nName: Muhammad Farid Donovant\nNIM: 24EO10021\nRole: Software Engineer\n\nSkills: JavaScript, HTML, CSS, Problem Solving, Team Work"], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'Resume_Muhammad_Farid.txt';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    setTimeout(() => this.innerText = originalText, 3000);
                }, 1500);
            }, 1500);
        });
    }

    // 2. Project Modal Logic
    const projectsData = {
        'Website Portfolio': { desc: 'Website portofolio interaktif dengan tema Hacker Terminal, dilengkapi dengan easter eggs, mini-games, dan CMS sederhana.', tech: 'HTML, CSS, Vanilla JS, Web Audio API' },
        'Mobile App': { desc: 'Aplikasi mobile untuk pemantauan data sistem secara real-time dengan antarmuka futuristik.', tech: 'React Native, Node.js, WebSocket' }
    };
    const modalWrapper = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTechList = document.getElementById('modal-tech-list');

    if (modalWrapper) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const name = card.innerText;
                const data = projectsData[name] || { desc: 'Data not found.', tech: 'Unknown' };
                modalTitle.innerText = name;
                modalDesc.innerText = data.desc;
                modalTechList.innerText = data.tech;
                modalWrapper.classList.remove('hidden');
            });
        });
        modalClose.addEventListener('click', () => modalWrapper.classList.add('hidden'));
    }

}