document.addEventListener('DOMContentLoaded', () => {
    // 1. Web Audio API SFX
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    let isDronePlaying = false;
    function startDrone() {
        if(isDronePlaying || !audioCtx) return;
        isDronePlaying = true;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gainNode = audioCtx.createGain();
        osc1.type = 'sawtooth'; osc1.frequency.value = 55;
        osc2.type = 'square'; osc2.frequency.value = 54.5;
        filter.type = 'lowpass'; filter.frequency.value = 400;
        gainNode.gain.value = 0.05;
        osc1.connect(filter); osc2.connect(filter); filter.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc1.start(); osc2.start();
        setInterval(() => {
            if(audioCtx.state === 'running') {
                const newFreq = 200 + Math.random() * 400;
                filter.frequency.linearRampToValueAtTime(newFreq, audioCtx.currentTime + 2);
            }
        }, 2000);
    }

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        startDrone();
    }

    function playTone(freq = 440, type = 'sine', duration = 0.1, vol = 0.05) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    // Initialize audio context on first user interaction
    document.body.addEventListener('click', initAudio, { once: true });
    document.body.addEventListener('keydown', initAudio, { once: true });

    document.addEventListener('click', (e) => {
        if(e.target.closest('button') || e.target.closest('a') || e.target.closest('.submit-btn')) {
            playTone(800, 'square', 0.1, 0.05); // click sound
        }
    });

    document.addEventListener('mouseover', (e) => {
        if(e.target.closest('button') || e.target.closest('a') || e.target.closest('.tab-btn') || e.target.closest('.project-card')) {
            playTone(400, 'sine', 0.05, 0.01); // hover blip
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            playTone(Math.random() * 200 + 600, 'triangle', 0.05, 0.02); // typing clack
        }
    });

    window.addEventListener('access-granted', () => {
        initAudio();
        setTimeout(() => playTone(1200, 'square', 0.4, 0.1), 100);
        setTimeout(() => playTone(1600, 'square', 0.6, 0.1), 300);
    });

    // 2. HUD System Info
    const hud = document.createElement('div');
    hud.id = 'cyber-hud';
    document.body.appendChild(hud);

    setInterval(() => {
        const cpu = Math.floor(Math.random() * 20 + 80);
        const mem = '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
        const net = Math.floor(Math.random() * 900 + 100);
        hud.innerHTML = `CPU: ${cpu}% | MEM: ${mem} | NET: ${net}Mb/s<br>SYS_STATUS: SECURE`;
    }, 500);

    // 3. Hacker Decryption Text Effect
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    
    function runDecrypt(target) {
        let iteration = 0;
        const original = target.dataset.value;
        
        clearInterval(target.interval);
        target.interval = setInterval(() => {
            target.innerText = original.split("").map((letter, index) => {
                if(index < iteration) {
                    return original[index];
                }
                return letters[Math.floor(Math.random() * letters.length)]
            }).join("");
            
            if(iteration >= original.length) {
                clearInterval(target.interval);
            }
            iteration += 1 / 3;
        }, 30);
    }

    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                if(!entry.target.dataset.value) {
                    entry.target.dataset.value = entry.target.innerText;
                }
                runDecrypt(entry.target);
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('h2').forEach(h2 => {
        h2.dataset.value = h2.innerText;
        headingObserver.observe(h2);
    });
    
    window.addEventListener('app-ready', () => {
        document.querySelectorAll('#main-app h2').forEach(h2 => {
            headingObserver.observe(h2);
        });
    });

    // 3.5 Text Scramble for Paragraphs
    const pElements = document.querySelectorAll('p');
    pElements.forEach(p => {
        if(p.id === 'typing-text' || p.id === 'age-display' || p.closest('#cheat-hud') || p.closest('#cmd-terminal') || p.closest('.auth-wrapper') || p.querySelector('a')) return;
        
        p.addEventListener('mouseenter', () => {
            if(p.isScrambling || !p.innerText) return;
            p.isScrambling = true;
            if(!p.dataset.original) p.dataset.original = p.innerText;
            
            let iteration = 0;
            const original = p.dataset.original;
            clearInterval(p.interval);
            
            p.interval = setInterval(() => {
                p.innerText = original.split("").map((letter, index) => {
                    if(index < iteration) return original[index];
                    if(letter === ' ') return ' ';
                    return letters[Math.floor(Math.random() * letters.length)];
                }).join("");
                
                if(iteration >= original.length) {
                    clearInterval(p.interval);
                    p.isScrambling = false;
                    p.innerText = original;
                }
                iteration += 1;
            }, 10);
        });
    });

    // 4. 3D Hologram Tilt Effect
    document.querySelectorAll('.card, .auth-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
            card.style.transition = `transform 0.5s ease`;
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = `none`;
        });
    });
});
