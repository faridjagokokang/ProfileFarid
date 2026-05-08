document.addEventListener('DOMContentLoaded', () => {
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

    const termBtn = document.createElement('button');
    termBtn.id = 'mobile-term-btn';
    termBtn.innerHTML = '>_';
    document.body.appendChild(termBtn);

    const radar = document.createElement('div');
    radar.id = 'radar-scanner';
    document.body.appendChild(radar);

    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            const blip = document.createElement('div');
            blip.className = 'radar-blip';
            blip.style.left = e.clientX + 'px';
            blip.style.top = e.clientY + 'px';
            document.body.appendChild(blip);
            setTimeout(() => blip.remove(), 2000);
        }
    });

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

    // VFS Implementation
    const vfs = {
        'home': {
            'farid': {
                'system_root': {
                    'passwords.txt': 'ENCRYPTED_OR_LOCAL_STORAGE',
                    'secret_cam.sh': 'EXECUTABLE_SCRIPT',
                    'system_config.dat': 'SYS_MODE=PROD<br>FIREWALL=ACTIVE<br>AUTHOR=FARID',
                    'project_alpha.exe': 'EXECUTABLE_BINARY_NOT_SUPPORTED',
                    'hidden_folder': {
                        'diary.txt': 'Hari ini aku belajar memanipulasi DOM dan Matrix effects. Web ini akan jadi portfolio terbaikku!',
                        'flag.txt': 'CTF{h4ck3r_m4st3r_f4r1d_2024}'
                    }
                }
            }
        }
    };
    let currentPath = ['home', 'farid', 'system_root'];

    function getVfsNode(pathArray) {
        let node = vfs;
        for (let part of pathArray) {
            if (node[part] !== undefined) node = node[part];
            else return null;
        }
        return node;
    }

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
            "KETIK, 'help' UNTUK MELIHAT DAFTAR PERINTAH!!!."
        ];

        let i = 0;
        function printNext() {
            if (!isOpen) return;
            if (i < bootLines.length) {
                if (i === 2) {
                    printOutput(`<pre style="color:var(--text-primary); margin:0;">${asciiArt}</pre>`, true);
                } else {
                    printOutput(bootLines[i]);
                }
                i++;
                setTimeout(printNext, i === 3 ? 100 : 300);
            } else {
                input.disabled = false;
                if (isOpen) input.focus();
            }
        }
        printNext();
    }

    window.currentTerminalGame = null;
    window.currentTerminalKeydown = null;
    window.currentTerminalKeyup = null;
    window.currentTerminalStream = null;

    function cleanupTerminalProcesses() {
        if (window.currentTerminalGame) {
            clearInterval(window.currentTerminalGame);
            window.currentTerminalGame = null;
        }
        if (window.currentTerminalKeydown) {
            document.removeEventListener('keydown', window.currentTerminalKeydown);
            window.currentTerminalKeydown = null;
        }
        if (window.currentTerminalKeyup) {
            document.removeEventListener('keyup', window.currentTerminalKeyup);
            window.currentTerminalKeyup = null;
        }
        if (window.currentTerminalStream) {
            window.currentTerminalStream.getTracks().forEach(t => t.stop());
            window.currentTerminalStream = null;
        }
        const typer = document.getElementById('hacker-typer');
        if (typer) typer.classList.add('hidden');
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
        if (!currentUser) return;

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

    const rootAccessBtn = document.getElementById('root-access-btn');
    if (rootAccessBtn) {
        rootAccessBtn.addEventListener('click', toggleTerminal);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    closeBtn.addEventListener('click', () => {
        if (isOpen) toggleTerminal();
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

  [ GENERAL ]
  help               : Show this message
  whoami             : Display current entity
  clear              : Clear terminal output
  date               : Display system date

  [ FILESYSTEM ]
  pwd                : Print working directory
  ls                 : List directory contents
  cd [dir]           : Change directory
  cat [file]         : Read file contents

  [ HACKER / SYSTEM ]
  sudo hack          : Access mainframe
  hack target        : Init HackerTyper Uplink
  analyze network    : IP/Geo Tracker
  enable voice_uplink: Voice Control
  initiate self-destruct : WARNING

  [ MEDIA / EFFECTS ]
  rave               : Toggle Rave Mode
  play music         : Start Synthwave
  stop music         : Stop Synthwave
  color [hex/reset]  : Change Matrix Color

  [ MINI GAMES ]
  play snake         : FOS Snake Protocol
  play pong          : FOS Pong Protocol`;
            printOutput(`<pre style="margin:0; font-family: inherit;">${helpText}</pre>`, true);

        } else if (cmd === 'whoami') {
            const user = sessionStorage.getItem('porto_current_user') || 'GUEST';
            printOutput('CURRENT ENTITY: ' + user);
        } else if (cmd === 'clear') {
            output.innerHTML = '';
        } else if (cmd === 'date') {
            printOutput(new Date().toString());
        } else if (cmd === 'ls') {
            const node = getVfsNode(currentPath);
            if (typeof node === 'object') {
                const keys = Object.keys(node);
                if (keys.length === 0) {
                    printOutput('');
                } else {
                    const outputStr = keys.map(k => typeof node[k] === 'object' ? `<span style="color:#00ffff">${k}/</span>` : k).join(' &nbsp;&nbsp; ');
                    printOutput(outputStr, true);
                }
            } else {
                printOutput(`ls: cannot access: Not a directory`);
            }
        } else if (cmd.startsWith('cat ')) {
            const file = cmd.substring(4).trim();
            const node = getVfsNode(currentPath);
            
            if (file === 'passwords.txt' || file === 'password.txt') {
                if (node && (node[file] || file === 'password.txt' && node['passwords.txt'])) {
                    try {
                        const usersRaw = localStorage.getItem('porto_users');
                        if (usersRaw) {
                            const users = JSON.parse(usersRaw);
                            if (users.length > 0) {
                                let out = 'DECRYPTED LOCAL ACCOUNTS:<br>';
                                users.forEach(u => {
                                    out += `USER: ${u.username} | PASS: ${u.password} <br>`;
                                });
                                printOutput(out, true);
                            } else {
                                printOutput('FILE EMPTY: NO REGISTERED ENTITIES.');
                            }
                        } else {
                            printOutput('FILE EMPTY: NO REGISTERED ENTITIES.');
                        }
                    } catch (e) {
                        printOutput('ERROR READING FILE.');
                    }
                } else {
                    printOutput(`cat: ${file}: No such file or directory`);
                }
            } else if (file === 'secret_cam.sh' || file === 'secret_cam' || file === 'cam') {
                if (node && node['secret_cam.sh']) {
                    openCamera();
                } else {
                    printOutput(`cat: ${file}: No such file or directory`);
                }
            } else {
                if (node && node[file]) {
                    if (typeof node[file] === 'object') {
                        printOutput(`cat: ${file}: Is a directory`);
                    } else {
                        printOutput(node[file], true);
                    }
                } else {
                    printOutput(`cat: ${file}: No such file or directory`);
                }
            }
        } else if (cmd === 'sudo hack') {
            printOutput('ACCESSING MAINFRAME...', false);
            setTimeout(() => printOutput('<span style="color:#ff0000">ERROR: UNAUTHORIZED. INITIATING COUNTERMEASURES.</span>', true), 1000);
            setTimeout(() => window.triggerRedAlert(), 2500);
        } else if (cmd === 'play snake') {
            startSnakeGame();
        } else if (cmd === 'play pong') {
            startPongGame();
        } else if (cmd === 'hack target') {
            startHackerTyper();
        } else if (cmd === 'analyze network') {
            analyzeNetwork();
        } else if (cmd === 'enable voice_uplink') {
            enableVoiceUplink();
        } else if (cmd === 'initiate self-destruct') {
            startSelfDestruct();
        } else if (cmd === '7355608') {
            defuseSelfDestruct();
        } else if (cmd === 'rave') {
            toggleRaveMode();
        } else if (cmd === 'play music') {
            playSynthMusic();
        } else if (cmd === 'stop music') {
            stopSynthMusic();
        } else if (cmd.startsWith('color ')) {
            const col = cmd.substring(6).trim();
            if (col === 'reset') {
                window.matrixColorOverride = null;
                printOutput('MATRIX COLOR RESET TO DEFAULT.');
            } else {
                window.matrixColorOverride = col;
                printOutput('MATRIX COLOR OVERRIDDEN TO: <span style="color:' + col + '">' + col + '</span>', true);
            }
        } else if (cmd === 'pwd') {
            printOutput('/' + currentPath.join('/'));
        } else if (cmd.startsWith('cd ')) {
            let dir = cmd.substring(3).trim();
            if (dir.endsWith('/')) dir = dir.slice(0, -1); // Remove trailing slash
            if (dir === '..') {
                if (currentPath.length > 0) currentPath.pop();
            } else if (dir === '/' || dir === '~') {
                currentPath = ['home', 'farid', 'system_root'];
            } else {
                const node = getVfsNode(currentPath);
                if (node && node[dir]) {
                    if (typeof node[dir] === 'object') {
                        currentPath.push(dir);
                    } else {
                        printOutput(`cd: ${dir}: Not a directory`);
                    }
                } else {
                    printOutput(`cd: ${dir}: No such file or directory`);
                }
            }
        } else {
            printOutput(`COMMAND NOT FOUND: ${cmd}`);
        }
    }

    function openCamera() {
        if (window.currentTerminalStream) {
            printOutput('<span style="color:red">ERROR: CAMERA ALREADY IN USE.</span>', true);
            return;
        }
        printOutput('INITIALIZING WEBCAM UPLINK...', false);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    window.currentTerminalStream = stream;
                    printOutput('<span style="color:#22c55e">UPLINK ESTABLISHED. PROCESSING ASCII MATRIX FILTER...</span>', true);

                    const video = document.createElement('video');
                    video.autoplay = true;
                    video.srcObject = stream;
                    video.style.display = 'none';
                    document.body.appendChild(video);

                    const canvas = document.createElement('canvas');
                    const w = 80; const h = 60; // Low res for ASCII
                    canvas.width = w; canvas.height = h;
                    canvas.style.width = '100%';
                    canvas.style.maxWidth = '400px';
                    canvas.style.imageRendering = 'pixelated';
                    canvas.style.border = '2px solid var(--accent-color)';
                    canvas.style.boxShadow = '0 0 10px var(--accent-color)';
                    canvas.style.marginTop = '10px';
                    canvas.style.display = 'block';
                    canvas.style.fontFamily = 'monospace';
                    output.appendChild(canvas);

                    const ctx = canvas.getContext('2d');
                    // ASCII characters mapped from darkest to lightest
                    const asciiChars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];

                    let asciiInterval = setInterval(() => {
                        if (video.videoWidth > 0) {
                            ctx.drawImage(video, 0, 0, w, h);
                            const frame = ctx.getImageData(0, 0, w, h);
                            const data = frame.data;

                            ctx.fillStyle = '#000';
                            ctx.fillRect(0, 0, w, h);
                            ctx.fillStyle = '#00ff00';
                            ctx.font = '2px monospace'; // Very tiny, relies on CSS scaling

                            for (let y = 0; y < h; y += 2) { // Skip lines for performance and char aspect ratio
                                for (let x = 0; x < w; x++) {
                                    const i = (y * w + x) * 4;
                                    const r = data[i];
                                    const g = data[i + 1];
                                    const b = data[i + 2];
                                    // Calculate brightness
                                    const brightness = (r + g + b) / 3;
                                    const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
                                    ctx.fillText(asciiChars[charIndex], x, y);
                                }
                            }
                        }
                    }, 50);

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
                        clearInterval(asciiInterval);
                        video.remove();
                        cleanupTerminalProcesses();
                        canvas.remove();
                        closeCam.remove();
                        printOutput('UPLINK TERMINATED.');
                    };
                    output.appendChild(closeCam);
                    output.scrollTop = output.scrollHeight;
                })
                .catch(function (err) {
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
        canvas.style.maxWidth = '100%'; canvas.style.height = 'auto';
        output.appendChild(canvas);
        output.scrollTop = output.scrollHeight;

        let dpad = null;
        if (isMobile) {
            dpad = document.createElement('div');
            dpad.id = 'snake-dpad';
            dpad.innerHTML = `
            < div class= "dpad-row" > <button id="dpad-up">▲</button></div >
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
                < div class= "dpad-row" > <button id="dpad-up">▲</button></div >
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
            if (e.keyCode === 38 || e.keyCode === 87) pDir = -1;
            else if (e.keyCode === 40 || e.keyCode === 83) pDir = 1;
            else if (e.keyCode === 27) {
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

    function startHackerTyper() {
        printOutput('INITIATING HACKER UPLINK...', false);
        const typer = document.getElementById('hacker-typer');
        const codeBlock = document.getElementById('typer-code');
        const progressSpan = document.getElementById('typer-progress');
        const grantedMsg = document.getElementById('typer-granted');

        if (!typer || !codeBlock) {
            printOutput('<span style="color:red">ERROR: HACKER MODULE NOT FOUND.</span>', true);
            return;
        }

        input.disabled = true;
        input.blur();
        typer.classList.remove('hidden');
        codeBlock.innerHTML = '';
        grantedMsg.classList.add('hidden');
        progressSpan.innerText = '0';

        const snippet = `
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>

int main(int argc, char *argv[]) {
    printf("Establishing connection to %s...\\n", argv[1]);
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if(sock < 0) {
        perror("Socket creation failed");
        return 1;
    }
    // Bypassing firewall...
    // Decrypting handshake keys...
    // Access granted!
    return 0;
}
`;
        let i = 0;
        let progress = 0;
        const typeInterval = setInterval(() => {
            if (i < snippet.length) {
                codeBlock.innerHTML += snippet[i] === '\\n' ? '<br>' : snippet[i];
                i++;
                if (Math.random() > 0.5) {
                    progress += Math.floor(Math.random() * 3);
                    if (progress > 99) progress = 99;
                    progressSpan.innerText = progress;
                }
            } else {
                clearInterval(typeInterval);
                progressSpan.innerText = '100';
                setTimeout(() => {
                    grantedMsg.classList.remove('hidden');
                    setTimeout(() => {
                        typer.classList.add('hidden');
                        input.disabled = false;
                        setTimeout(() => { if (isOpen) input.focus(); }, 100);
                        printOutput('<span style="color:#0f0">UPLINK SUCCESSFUL. MAINFRAME ACCESSED.</span>', true);
                    }, 2000);
                }, 500);
            }
        }, 15);
        window.currentTerminalGame = typeInterval;
    }

    function analyzeNetwork() {
        printOutput('ANALYZING NETWORK TOPOLOGY...');
        setTimeout(() => printOutput('TRACING IP ROUTE: 192.168.1.1 -> 10.0.0.5 -> 172.16.254.1'), 1000);
        setTimeout(() => printOutput('RESOLVING HOST: target.mainframe.local'), 2000);
        setTimeout(() => printOutput('GEO-LOCATION PING: -6.2088, 106.8456 (JAKARTA, ID)'), 3000);
        setTimeout(() => printOutput('<span style="color:#0f0">NETWORK ANALYSIS COMPLETE.</span>', true), 4000);
    }

    function enableVoiceUplink() {
        printOutput('INITIALIZING VOICE RECOGNITION MODULE...');
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            setTimeout(() => printOutput('<span style="color:#0f0">VOICE UPLINK ESTABLISHED.</span>', true), 1000);
        } else {
            setTimeout(() => printOutput('<span style="color:red">ERROR: VOICE MODULE UNSUPPORTED BY CURRENT HARDWARE.</span>', true), 1000);
        }
    }

    let sdInterval = null;
    function startSelfDestruct() {
        const sdOverlay = document.getElementById('self-destruct-overlay');
        const timerEl = document.getElementById('sd-timer');
        if (!sdOverlay || !timerEl) {
            printOutput('<span style="color:red">ERROR: CORE MELTDOWN OVERRIDE NOT FOUND.</span>', true);
            return;
        }

        if (sdInterval) return;

        printOutput('<span style="color:red; font-size:1.5em; font-weight:bold;">WARNING: SELF DESTRUCT INITIATED</span>', true);
        window.triggerRedAlert();
        sdOverlay.classList.remove('hidden');

        let timeLeft = 60.00;
        sdInterval = setInterval(() => {
            timeLeft -= 0.01;
            if (timeLeft <= 0) {
                timeLeft = 0.00;
                clearInterval(sdInterval);
                sdInterval = null;
                document.body.innerHTML = '<div style="background:black; width:100vw; height:100vh; display:flex; justify-content:center; align-items:center; color:red; font-family:sans-serif; font-size:3rem; font-weight:bold;">SYSTEM PURGED.</div>';
            }
            timerEl.innerText = timeLeft.toFixed(2);
        }, 10);
    }

    function defuseSelfDestruct() {
        if (!sdInterval) {
            printOutput('NO ACTIVE SELF DESTRUCT SEQUENCE FOUND.');
            return;
        }
        clearInterval(sdInterval);
        sdInterval = null;
        const sdOverlay = document.getElementById('self-destruct-overlay');
        if (sdOverlay) sdOverlay.classList.add('hidden');
        document.body.classList.remove('red-alert');
        printOutput('<span style="color:#0f0; font-size:1.2em;">DEFUSE CODE ACCEPTED. SELF DESTRUCT ABORTED.</span>', true);
    }

    let raveInterval = null;
    function toggleRaveMode() {
        if (raveInterval) {
            clearInterval(raveInterval);
            raveInterval = null;
            document.body.style.filter = '';
            printOutput('RAVE MODE DEACTIVATED.');
        } else {
            printOutput('RAVE MODE ACTIVATED. <span class="blink">UNCE UNCE UNCE</span>', true);
            let hue = 0;
            raveInterval = setInterval(() => {
                hue = (hue + 25) % 360;
                document.body.style.filter = `hue-rotate(${hue}deg) saturate(200%)`;
            }, 50);
        }
    }

    let synthInterval = null;
    function playSynthMusic() {
        if (synthInterval) {
            printOutput('SYNTHWAVE ALREADY PLAYING.');
            return;
        }
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            printOutput('<span style="color:red">ERROR: AUDIO HARDWARE MISSING.</span>', true);
            return;
        }
        printOutput('<span style="color:#ff00ff">STARTING SYNTHWAVE PROTOCOL...</span>', true);
        const ctx = new AudioContext();

        const playNote = (freq, duration, type = 'square') => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        };

        const bassPattern = [55, 55, 65, 55, 73, 55, 65, 55];
        let step = 0;

        synthInterval = setInterval(() => {
            playNote(bassPattern[step % bassPattern.length], 0.2, 'sawtooth');
            if (step % 4 === 0) playNote(220, 0.1, 'square');
            step++;
        }, 200);
    }

    function stopSynthMusic() {
        if (synthInterval) {
            clearInterval(synthInterval);
            synthInterval = null;
            printOutput('SYNTHWAVE STOPPED.');
        } else {
            printOutput('NO MUSIC PLAYING.');
        }
    }

    let isRedAlert = false;
    window.triggerRedAlert = function () {
        if (isRedAlert) return;
        isRedAlert = true;

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

        document.body.classList.add('red-alert');
        window.matrixSpeedMultiplier = 8;

        const banner = document.createElement('div');
        banner.className = 'breach-banner';
        banner.innerText = 'WARNING: UNAUTHORIZED SYSTEM BREACH';
        document.body.appendChild(banner);
    };

    let clickCount = 0;
    let clickTimer;

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

