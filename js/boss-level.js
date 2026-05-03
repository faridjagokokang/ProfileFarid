document.addEventListener('DOMContentLoaded', () => {
    // 1. Cheat Sheet HUD
    const isMobile = window.innerWidth <= 768;
    const cheatHud = document.createElement('div');
    cheatHud.id = 'cheat-hud';
    cheatHud.innerHTML = `
        <div style="margin-bottom: 3px; border-bottom: 1px dashed var(--warning-color); padding-bottom: 2px;">[SYSTEM_MANUAL]</div>
        <div>> ${isMobile ? 'TAP >_ BTN' : "PRESS '~' OR '\`'"} FOR TERMINAL</div>
        <div>> TAP PHOTO 3X QUICKLY</div>
        <div style="margin-top: 5px;">> RADAR <span class="blink">@#$%</span> ONLINE</div>
        <div style="margin-top: 3px; color: var(--text-primary);">> TRY 'play snake' IN TERM</div>
    `;
    document.body.appendChild(cheatHud);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            cheatHud.style.opacity = '0';
        } else {
            cheatHud.style.opacity = '1';
        }
    });

    // Mobile Terminal Button
    const termBtn = document.createElement('button');
    termBtn.id = 'mobile-term-btn';
    termBtn.innerHTML = '>_';
    document.body.appendChild(termBtn);

    // 2. Interactive Radar Background
    const radar = document.createElement('div');
    radar.id = 'radar-scanner';
    document.body.appendChild(radar);

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) { // Only occasionally spawn blips to save performance
            const blip = document.createElement('div');
            blip.className = 'radar-blip';
            blip.style.left = e.clientX + 'px';
            blip.style.top = e.clientY + 'px';
            document.body.appendChild(blip);
            setTimeout(() => blip.remove(), 2000);
        }
    });

    // 3. Secret Terminal
    const termHtml = `
        <div id="cmd-terminal">
            <div id="cyber-globe-wrapper">
                <div class="globe">
                    <div class="ring"></div>
                    <div class="ring"></div>
                    <div class="ring"></div>
                    <div class="ring"></div>
                    <div class="ring"></div>
                    <div class="ring equator"></div>
                </div>
            </div>
            <div class="cmd-header">
                <span>FARID@SYSTEM:~</span>
                <button id="cmd-close">[X]</button>
            </div>
            <div id="cmd-output"></div>
            <div class="cmd-input-line">
                <span>FARID $</span>
                <input type="text" id="cmd-input" autocomplete="off" spellcheck="false">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', termHtml);

    const term = document.getElementById('cmd-terminal');
    const output = document.getElementById('cmd-output');
    const input = document.getElementById('cmd-input');
    const closeBtn = document.getElementById('cmd-close');

    let isOpen = false;
    let hasBooted = false;

    function bootTerminal() {
        if (hasBooted) return;
        hasBooted = true;
        input.disabled = true;

        const asciiArt = `
  ______ ____   _____   __      _____   ___  
 |  ____/ __ \\ / ____|  \\ \\    / /__ \\ / _ \\ 
 | |__ | |  | | (___     \\ \\  / /   ) | | | |
 |  __|| |  | |\\___ \\     \\ \\/ /   / /| | | |
 | |   | |__| |____) |     \\  /   / /_| |_| |
 |_|    \\____/|_____/       \\/   |____|\\___/ 
        `;

        const bootLines = [
            "CONNECTING TO SECURE MAINFRAME...",
            "ESTABLISHING ENCRYPTED SHELL...",
            asciiArt,
            "FOS V2.0 (Farid Operating System)",
            "WELCOME, ADMINISTRATOR.",
            "TYPE 'help' TO VIEW AVAILABLE COMMANDS."
        ];

        let i = 0;
        function printNext() {
            if(!isOpen) return; // Stop booting if closed
            if (i < bootLines.length) {
                if (i === 2) {
                    printOutput(`<pre style="color:var(--text-primary); margin:0;">${asciiArt}</pre>`, true);
                } else {
                    printOutput(bootLines[i]);
                }
                i++;
                setTimeout(printNext, i === 3 ? 100 : 300); // quick print after ascii
            } else {
                input.disabled = false;
                if(isOpen) input.focus();
            }
        }
        printNext();
    }

    // Global process tracking for terminal
    window.currentTerminalGame = null;
    window.currentTerminalKeydown = null;
    window.currentTerminalKeyup = null;
    window.currentTerminalStream = null;

    function cleanupTerminalProcesses() {
        if(window.currentTerminalGame) {
            clearInterval(window.currentTerminalGame);
            window.currentTerminalGame = null;
        }
        if(window.currentTerminalKeydown) {
            document.removeEventListener('keydown', window.currentTerminalKeydown);
            window.currentTerminalKeydown = null;
        }
        if(window.currentTerminalKeyup) {
            document.removeEventListener('keyup', window.currentTerminalKeyup);
            window.currentTerminalKeyup = null;
        }
        if(window.currentTerminalStream) {
            window.currentTerminalStream.getTracks().forEach(t => t.stop());
            window.currentTerminalStream = null;
        }
        input.disabled = false;
    }

    function updateAuthVisibility() {
        if (sessionStorage.getItem('porto_current_user')) {
            cheatHud.style.display = '';
            termBtn.style.display = '';
        } else {
            cheatHud.style.display = 'none';
            termBtn.style.display = 'none';
            if (isOpen) toggleTerminal();
        }
    }
    
    window.addEventListener('app-ready', updateAuthVisibility);
    window.addEventListener('app-logout', updateAuthVisibility);
    updateAuthVisibility();

    function toggleTerminal() {
        const currentUser = sessionStorage.getItem('porto_current_user');
        if (!currentUser) return; // Cannot access terminal if not logged in
        
        isOpen = !isOpen;
        if (isOpen) {
            term.style.transform = 'translateY(0)';
            if (!hasBooted) {
                bootTerminal();
            } else {
                setTimeout(() => input.focus(), 300);
            }
        } else {
            term.style.transform = 'translateY(-100%)';
            input.blur();
            cleanupTerminalProcesses();
        }
    }

    termBtn.addEventListener('click', toggleTerminal);

    window.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    closeBtn.addEventListener('click', () => {
        if(isOpen) toggleTerminal();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (val) {
                printOutput(`$ ${val}`);
                processCmd(val.toLowerCase());
            }
            input.value = '';
        }
    });

    function printOutput(text, isHtml = false) {
        const p = document.createElement('div');
        p.style.marginBottom = '5px';
        if (isHtml) p.innerHTML = text;
        else p.textContent = text;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }

    function processCmd(cmd) {
        if (cmd === 'help') {
            const helpText = `AVAILABLE COMMANDS:
  help        : Show this message
  whoami      : Display current entity
  clear       : Clear terminal output
  date        : Display system date
  ls          : List directory contents
  cat [file]  : Read file contents
  sudo hack   : Access mainframe (UNAUTHORIZED)
  |MINI GAME|
  play snake  : Execute FOS Snake Protocol
  play pong   : Execute FOS Pong Protocol`;
            printOutput(`<pre style="margin:0; font-family: inherit;">${helpText}</pre>`, true);
        } else if (cmd === 'whoami') {
            const user = sessionStorage.getItem('porto_current_user') || 'GUEST';
            printOutput('CURRENT ENTITY: ' + user);
        } else if (cmd === 'clear') {
            output.innerHTML = '';
        } else if (cmd === 'date') {
            printOutput(new Date().toString());
        } else if (cmd === 'ls') {
            printOutput('passwords.txt   secret_cam.sh   project_alpha.exe   system_config.dat   hidden_folder/');
        } else if (cmd.startsWith('cat ')) {
            const file = cmd.substring(4).trim();
            if (file === 'passwords.txt' || file === 'password.txt') {
                try {
                    const usersRaw = localStorage.getItem('porto_users');
                    if (usersRaw) {
                        const users = JSON.parse(usersRaw);
                        if (users.length > 0) {
                            let out = 'DECRYPTED LOCAL ACCOUNTS:<br>';
                            users.forEach(u => {
                                out += `USER: ${u.username} | PASS: ${u.password}<br>`;
                            });
                            printOutput(out, true);
                        } else {
                            printOutput('FILE EMPTY: NO REGISTERED ENTITIES.');
                        }
                    } else {
                        printOutput('FILE EMPTY: NO REGISTERED ENTITIES.');
                    }
                } catch(e) {
                    printOutput('ERROR READING FILE.');
                }
            } else if (file === 'secret_cam.sh' || file === 'secret_cam' || file === 'cam') {
                openCamera();
            } else if (file === 'system_config.dat' || file === 'system_config') {
                printOutput('SYS_MODE=PROD<br>FIREWALL=ACTIVE<br>AUTHOR=FARID', true);
            } else {
                printOutput(`cat: ${file}: Permission denied or file not found.`);
            }
        } else if (cmd === 'sudo hack') {
            printOutput('ACCESSING MAINFRAME...', false);
            setTimeout(() => printOutput('<span style="color:#ff0000">ERROR: UNAUTHORIZED. INITIATING COUNTERMEASURES.</span>', true), 1000);
            setTimeout(() => window.triggerRedAlert(), 2500);
        } else if (cmd === 'play snake') {
            startSnakeGame();
        } else if (cmd === 'play pong') {
            startPongGame();
        } else {
            printOutput(`COMMAND NOT FOUND: ${cmd}`);
        }
    }

    function openCamera() {
        if(window.currentTerminalStream) {
            printOutput('<span style="color:red">ERROR: CAMERA ALREADY IN USE.</span>', true);
            return;
        }
        printOutput('INITIALIZING WEBCAM UPLINK...', false);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    window.currentTerminalStream = stream;
                    printOutput('<span style="color:#22c55e">UPLINK ESTABLISHED.</span>', true);
                    
                    const video = document.createElement('video');
                    video.autoplay = true;
                    video.style.width = '100%';
                    video.style.maxWidth = '400px';
                    video.style.border = '2px solid var(--accent-color)';
                    video.style.boxShadow = '0 0 10px var(--accent-color)';
                    video.style.marginTop = '10px';
                    video.style.display = 'block';
                    video.srcObject = stream;
                    output.appendChild(video);
                    
                    const closeCam = document.createElement('button');
                    closeCam.innerText = '[ TERMINATE CONNECTION ]';
                    closeCam.style.background = 'red';
                    closeCam.style.color = '#fff';
                    closeCam.style.border = 'none';
                    closeCam.style.padding = '5px 10px';
                    closeCam.style.marginTop = '5px';
                    closeCam.style.marginBottom = '10px';
                    closeCam.style.cursor = 'pointer';
                    closeCam.style.fontFamily = 'inherit';
                    closeCam.onclick = () => {
                        cleanupTerminalProcesses();
                        video.remove();
                        closeCam.remove();
                        printOutput('UPLINK TERMINATED.');
                    };
                    output.appendChild(closeCam);
                    output.scrollTop = output.scrollHeight;
                })
                .catch(function(err) {
                    printOutput('<span style="color:red">ERROR: UPLINK FAILED. CAMERA ACCESS DENIED.</span>', true);
                });
        } else {
            printOutput('<span style="color:red">ERROR: HARDWARE NOT FOUND OR HTTPS REQUIRED.</span>', true);
        }
    }

    function startSnakeGame() {
        printOutput('<div style="text-align:center; color: var(--accent-color); margin: 10px 0; font-size: 1.2rem;">--- FOS SNAKE PROTOCOL ---<br>USE CONTROLS. ESC TO EXIT.</div>', true);
        const canvas = document.createElement('canvas');
        canvas.width = 600; canvas.height = 300;
        canvas.style.border = '2px solid var(--accent-color)';
        canvas.style.boxShadow = '0 0 15px var(--accent-color)';
        canvas.style.display = 'block'; canvas.style.margin = '0 auto 10px';
        canvas.style.maxWidth = '100%'; canvas.style.height = 'auto'; // Responsive for mobile
        output.appendChild(canvas);
        output.scrollTop = output.scrollHeight;

        // Mobile D-PAD
        let dpad = null;
        if (isMobile) {
            dpad = document.createElement('div');
            dpad.id = 'snake-dpad';
            dpad.innerHTML = `
                <div class="dpad-row"><button id="dpad-up">▲</button></div>
                <div class="dpad-row"><button id="dpad-left">◀</button><button id="dpad-down">▼</button><button id="dpad-right">▶</button></div>
                <div class="dpad-row"><button id="dpad-esc" style="background: rgba(255,0,0,0.3); font-size:0.8rem">QUIT</button></div>
            `;
            output.appendChild(dpad);
            output.scrollTop = output.scrollHeight;

            const addControl = (id, newDir, notDir) => {
                const btn = document.getElementById(id);
                if (!btn) return;
                btn.addEventListener('touchstart', (e) => { e.preventDefault(); if (d != notDir) d = newDir; });
                btn.addEventListener('mousedown', (e) => { e.preventDefault(); if (d != notDir) d = newDir; });
            };
            addControl('dpad-up', 'UP', 'DOWN');
            addControl('dpad-down', 'DOWN', 'UP');
            addControl('dpad-left', 'LEFT', 'RIGHT');
            addControl('dpad-right', 'RIGHT', 'LEFT');

            const escBtn = document.getElementById('dpad-esc');
            const quitFn = (e) => {
                e.preventDefault();
                cleanupTerminalProcesses();
                if (dpad) dpad.remove();
                input.focus();
                printOutput('SNAKE TERMINATED. SCORE: ' + score);
            };
            escBtn.addEventListener('touchstart', quitFn);
            escBtn.addEventListener('mousedown', quitFn);
        }

        input.disabled = true;
        input.blur();

        const ctx = canvas.getContext('2d');
        const box = 15;
        let snake = [{ x: 10 * box, y: 10 * box }];
        let food = { x: Math.floor(Math.random() * 40) * box, y: Math.floor(Math.random() * 20) * box };
        let d = "RIGHT";
        let score = 0;

        const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#00ff00';
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#008800';

        const keyHandler = (e) => {
            if ([37, 38, 39, 40, 27].includes(e.keyCode)) e.preventDefault();
            if (e.keyCode == 37 && d != "RIGHT") d = "LEFT";
            else if (e.keyCode == 38 && d != "DOWN") d = "UP";
            else if (e.keyCode == 39 && d != "LEFT") d = "RIGHT";
            else if (e.keyCode == 40 && d != "UP") d = "DOWN";
            else if (e.keyCode == 27) { // ESC
                cleanupTerminalProcesses();
                if (dpad) dpad.remove();
                input.focus();
                printOutput('SNAKE TERMINATED. SCORE: ' + score);
            }
        };
        window.currentTerminalKeydown = keyHandler;
        document.addEventListener('keydown', keyHandler);

        function draw() {
            ctx.fillStyle = "rgba(0,5,0,0.9)";
            ctx.fillRect(0, 0, 600, 300);
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? themeColor : accentColor;
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = "#000";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }
            ctx.fillStyle = "red"; ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x; let snakeY = snake[0].y;
            if (d == "LEFT") snakeX -= box;
            if (d == "UP") snakeY -= box;
            if (d == "RIGHT") snakeX += box;
            if (d == "DOWN") snakeY += box;

            if (snakeX == food.x && snakeY == food.y) {
                score++;
                food = { x: Math.floor(Math.random() * 40) * box, y: Math.floor(Math.random() * 20) * box };
            } else {
                snake.pop();
            }

            let newHead = { x: snakeX, y: snakeY };
            if (snakeX < 0 || snakeX >= 600 || snakeY < 0 || snakeY >= 300 || collision(newHead, snake)) {
                cleanupTerminalProcesses();
                if (dpad) dpad.remove();
                input.disabled = false;
                setTimeout(() => { if (!isMobile && isOpen) input.focus(); printOutput('<span style="color:red">GAME OVER</span>. SCORE: ' + score, true); }, 500);
            }
            snake.unshift(newHead);
            ctx.fillStyle = themeColor; ctx.font = "12px 'Fira Code', monospace";
            ctx.fillText("SCORE: " + score, box, 2 * box);
        }

        function collision(head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x == array[i].x && head.y == array[i].y) return true;
            }
            return false;
        }
        gameLoop = setInterval(draw, 100);
        window.currentTerminalGame = gameLoop;
    }

    function startPongGame() {
        printOutput('<div style="text-align:center; color: var(--accent-color); margin: 10px 0; font-size: 1.2rem;">--- FOS PONG PROTOCOL ---<br>USE UP/DOWN OR W/S. ESC TO EXIT.</div>', true);
        const canvas = document.createElement('canvas');
        canvas.width = 600; canvas.height = 300;
        canvas.style.border = '2px solid var(--accent-color)';
        canvas.style.boxShadow = '0 0 15px var(--accent-color)';
        canvas.style.display = 'block'; canvas.style.margin = '0 auto 10px';
        canvas.style.maxWidth = '100%'; canvas.style.height = 'auto';
        output.appendChild(canvas);
        output.scrollTop = output.scrollHeight;

        let dpad = null;
        let pDir = 0;

        if (isMobile) {
            dpad = document.createElement('div');
            dpad.id = 'pong-dpad';
            dpad.innerHTML = `
                <div class="dpad-row"><button id="dpad-up">▲</button></div>
                <div class="dpad-row"><button id="dpad-down">▼</button></div>
                <div class="dpad-row"><button id="dpad-esc" style="background: rgba(255,0,0,0.3); font-size:0.8rem">QUIT</button></div>
            `;
            output.appendChild(dpad);
            output.scrollTop = output.scrollHeight;

            const addControl = (id, dir) => {
                const btn = document.getElementById(id);
                if (!btn) return;
                btn.addEventListener('touchstart', (e) => { e.preventDefault(); pDir = dir; });
                btn.addEventListener('touchend', (e) => { e.preventDefault(); pDir = 0; });
                btn.addEventListener('mousedown', (e) => { e.preventDefault(); pDir = dir; });
                btn.addEventListener('mouseup', (e) => { e.preventDefault(); pDir = 0; });
                btn.addEventListener('mouseleave', (e) => { e.preventDefault(); pDir = 0; });
            };
            addControl('dpad-up', -1);
            addControl('dpad-down', 1);

            const escBtn = document.getElementById('dpad-esc');
            const quitFn = (e) => {
                e.preventDefault();
                clearInterval(gameLoop);
                document.removeEventListener('keydown', keyHandler);
                document.removeEventListener('keyup', keyUpHandler);
                if (dpad) dpad.remove();
                input.disabled = false;
                printOutput('PONG TERMINATED.');
            };
            escBtn.addEventListener('touchstart', quitFn);
            escBtn.addEventListener('mousedown', quitFn);
        }

        input.disabled = true;
        input.blur();

        const ctx = canvas.getContext('2d');
        const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#00ff00';

        let ball = { x: 300, y: 150, r: 8, dx: 4, dy: 4 };
        let player = { x: 20, y: 110, w: 10, h: 80, score: 0 };
        let ai = { x: 570, y: 110, w: 10, h: 80, score: 0 };

        const keyHandler = (e) => {
            if ([38, 40, 87, 83, 27].includes(e.keyCode)) e.preventDefault();
            if (e.keyCode === 38 || e.keyCode === 87) pDir = -1; // UP or W
            else if (e.keyCode === 40 || e.keyCode === 83) pDir = 1; // DOWN or S
            else if (e.keyCode === 27) { // ESC
                cleanupTerminalProcesses();
                if (dpad) dpad.remove();
                input.disabled = false; input.focus();
                printOutput('PONG TERMINATED.');
            }
        };
        const keyUpHandler = (e) => {
            if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 40 || e.keyCode === 83) pDir = 0;
        };

        window.currentTerminalKeydown = keyHandler;
        window.currentTerminalKeyup = keyUpHandler;
        document.addEventListener('keydown', keyHandler);
        document.addEventListener('keyup', keyUpHandler);

        function draw() {
            ctx.fillStyle = "rgba(0,5,0,0.9)";
            ctx.fillRect(0, 0, 600, 300);

            ctx.fillStyle = "rgba(0,255,0,0.2)";
            for (let i = 0; i < 300; i += 20) ctx.fillRect(298, i, 4, 10);

            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = themeColor;
            ctx.fillRect(player.x, player.y, player.w, player.h);
            ctx.fillRect(ai.x, ai.y, ai.w, ai.h);

            player.y += pDir * 6;
            if (player.y < 0) player.y = 0;
            if (player.y + player.h > 300) player.y = 300 - player.h;

            const aiSpeed = 3.5;
            if (ai.y + ai.h / 2 < ball.y - 10) ai.y += aiSpeed;
            else if (ai.y + ai.h / 2 > ball.y + 10) ai.y -= aiSpeed;

            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.y - ball.r < 0 || ball.y + ball.r > 300) ball.dy *= -1;

            let paddle = (ball.x < 300) ? player : ai;
            if (ball.x + ball.r > paddle.x && ball.x - ball.r < paddle.x + paddle.w &&
                ball.y + ball.r > paddle.y && ball.y - ball.r < paddle.y + paddle.h) {
                ball.dx *= -1.05;
                ball.dy = (ball.y - (paddle.y + paddle.h / 2)) * 0.15;
            }

            if (ball.x < 0) { ai.score++; resetBall(); }
            else if (ball.x > 600) { player.score++; resetBall(); }

            ctx.fillStyle = themeColor; ctx.font = "24px 'Fira Code', monospace";
            ctx.fillText(player.score, 150, 40);
            ctx.fillText(ai.score, 450, 40);
        }

        function resetBall() {
            ball.x = 300; ball.y = 150;
            ball.dx = (Math.random() > 0.5 ? 4 : -4);
            ball.dy = (Math.random() > 0.5 ? 4 : -4);
        }

        let gameLoop = setInterval(draw, 1000 / 60);
        window.currentTerminalGame = gameLoop;
    }

    // 4. RED ALERT MODE
    let isRedAlert = false;
    window.triggerRedAlert = function () {
        if (isRedAlert) return;
        isRedAlert = true;

        // Siren Sound
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const gain = ctx.createGain();
        gain.gain.value = 0.1;
        gain.connect(ctx.destination);

        setInterval(() => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.5);
            osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 1);
            osc.connect(gain);
            osc.start();
            osc.stop(ctx.currentTime + 1);
        }, 1000);

        // CSS Changes
        document.body.classList.add('red-alert');
        window.matrixSpeedMultiplier = 8; // Speed up matrix

        // Banner
        const banner = document.createElement('div');
        banner.className = 'breach-banner';
        banner.innerText = 'WARNING: UNAUTHORIZED SYSTEM BREACH';
        document.body.appendChild(banner);
    };

    // Trigger Red Alert via Photo
    let clickCount = 0;
    let clickTimer;

    // Use event delegation for photo since it might be re-rendered
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('profile-photo')) {
            clickCount++;
            clearTimeout(clickTimer);
            if (clickCount >= 3) {
                window.triggerRedAlert();
                clickCount = 0;
            } else {
                clickTimer = setTimeout(() => { clickCount = 0; }, 600);
            }
        }
    });
});
