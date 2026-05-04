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

    // 5. Custom Cursor & Trail
    const cursor = document.getElementById('cyber-cursor');
    const trailContainer = document.getElementById('cursor-trail-container');
    if (cursor && trailContainer && window.innerWidth > 768) {
        let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
        let cursorX = mouseX, cursorY = mouseY;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Create trail
            if (Math.random() > 0.3) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = mouseX + 'px';
                trail.style.top = mouseY + 'px';
                trailContainer.appendChild(trail);
                
                setTimeout(() => {
                    trail.style.opacity = '0';
                    trail.style.transition = 'opacity 0.4s';
                    setTimeout(() => trail.remove(), 400);
                }, 20);
            }
        });
        
        // Smooth cursor follow
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.4;
            cursorY += (mouseY - cursorY) * 0.4;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Cursor interactive states
        document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.8)');
        document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
        
        const interactables = document.querySelectorAll('a, button, input, textarea, .tab-btn, .project-card, .skill-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = 'var(--text-primary)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '24px';
                cursor.style.height = '24px';
                cursor.style.borderColor = 'var(--accent-color)';
            });
        });
    }

    // 6. 3D Hologram Wireframe (Vanilla Canvas)
    const holoCanvas = document.getElementById('hologram-canvas');
    if (holoCanvas) {
        const hCtx = holoCanvas.getContext('2d');
        let width = 200, height = 200;
        holoCanvas.width = width;
        holoCanvas.height = height;

        // Icosahedron vertices
        const phi = (1 + Math.sqrt(5)) / 2;
        let vertices = [
            [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
            [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
            [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
        ];
        
        // Normalize and scale
        vertices = vertices.map(v => {
            const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
            return [v[0]/len * 60, v[1]/len * 60, v[2]/len * 60];
        });

        const edges = [
            [0,11],[0,5],[0,1],[0,7],[0,10], [1,5],[1,9],[1,8],[1,7], [5,11],[5,4],[5,9],
            [11,10],[11,2],[11,4], [10,7],[10,6],[10,2], [7,8],[7,6], [9,8],[9,3],[9,4],
            [8,6],[8,3], [6,2],[6,3], [2,4],[2,3], [4,3]
        ];

        let angleX = 0, angleY = 0;
        let targetAngleX = 0, targetAngleY = 0;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            targetAngleY = x * Math.PI;
            targetAngleX = y * Math.PI;
        });

        function hexToRgb(hex) {
            if(hex.startsWith('#')) {
                let r=0,g=0,b=0;
                if(hex.length===4){ r=parseInt(hex[1]+hex[1],16); g=parseInt(hex[2]+hex[2],16); b=parseInt(hex[3]+hex[3],16); }
                else if(hex.length===7){ r=parseInt(hex.substring(1,3),16); g=parseInt(hex.substring(3,5),16); b=parseInt(hex.substring(5,7),16); }
                return `${r},${g},${b}`;
            }
            return '0,255,255'; 
        }

        function drawHologram() {
            hCtx.clearRect(0, 0, width, height);
            
            angleX += (targetAngleX - angleX) * 0.05;
            angleY += (targetAngleY - angleY) * 0.05 + 0.01; // Auto spin Y

            const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

            const projected = vertices.map(v => {
                let x1 = v[0] * cosY - v[2] * sinY;
                let z1 = v[0] * sinY + v[2] * cosY;
                let y1 = v[1];
                let y2 = y1 * cosX - z1 * sinX;
                let z2 = y1 * sinX + z1 * cosX;
                let x2 = x1;
                
                const fov = 150;
                const scale = fov / (fov + z2);
                return [x2 * scale + width/2, y2 * scale + height/2, z2];
            });

            // Dynamic color
            const rawAccent = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#00ffff';
            const rgbAccent = hexToRgb(rawAccent);
            
            edges.forEach(edge => {
                const p1 = projected[edge[0]];
                const p2 = projected[edge[1]];
                
                hCtx.beginPath();
                hCtx.moveTo(p1[0], p1[1]);
                hCtx.lineTo(p2[0], p2[1]);
                
                const zAvg = (p1[2] + p2[2]) / 2;
                const alpha = Math.max(0.05, 1 - (zAvg + 60) / 120);
                
                hCtx.strokeStyle = `rgba(${rgbAccent}, ${alpha})`;
                hCtx.lineWidth = 1.5;
                hCtx.stroke();
            });

            projected.forEach(p => {
                hCtx.beginPath();
                hCtx.arc(p[0], p[1], 2, 0, Math.PI*2);
                hCtx.fillStyle = `rgb(${rgbAccent})`;
                hCtx.fill();
            });

            requestAnimationFrame(drawHologram);
        }
        drawHologram();
    }
});
