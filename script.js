/* =================================================================== */
/* RUN ALL SCRIPTS ONCE THE PAGE IS LOADED
/* =================================================================== */
document.addEventListener("DOMContentLoaded", function() {

    /* --- GLOBAL VARIABLES FOR CAD --- */
    let cadRenderer, cadScene, cadCamera, cadAnimationId;
    let cadMesh;

    /* =================================================================== */
    /* 1. AUDIO SYNTHESIS
    /* =================================================================== */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(type) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'key') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        }
    }

    /* =================================================================== */
    /* 2. Vanta.js
    /* =================================================================== */
    let vantaEffect = VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff9500, 
        backgroundColor: 0x0, 
        points: 10.00,
        maxDistance: 25.00,
        spacing: 20.00
    });

    /* =================================================================== */
    /* 3. Konami Code
    /* =================================================================== */
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (!gameRunning && e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateHackerMode();
                konamiIndex = 0;
            }
        } else if (!gameRunning) {
            konamiIndex = 0;
        }
    });

    function activateHackerMode() {
        playSound('success');
        document.documentElement.style.setProperty('--primary-color', '#00ff00');
        document.documentElement.style.setProperty('--text-color', '#00ff00');
        document.documentElement.style.setProperty('--border-color', '#00ff00');
        vantaEffect.setOptions({ color: 0x00ff00, backgroundColor: 0x000000 });
        printToTerminal("SYSTEM HACKED. ROOT ACCESS GRANTED.");
    }

    /* =================================================================== */
    /* 4. Typed.js & Loading
    /* =================================================================== */
    var options = {
        strings: ["Initializing portfolio interface...", "Loading modules..."],
        typeSpeed: 40,
        backSpeed: 20,
        loop: false,
        showCursor: true,
        onComplete: function() {
            document.getElementById('loading-bar').style.display = 'block';
            startLoadingBar();
        }
    };
    var typed = new Typed('#typed-text', options);

    const loadingSquares = document.getElementById('loading-squares');
    const numSquares = 10;
    let currentSquare = 0;

    function startLoadingBar() {
        for (let i = 0; i < numSquares; i++) {
            const square = document.createElement('span');
            square.className = 'loading-square';
            loadingSquares.appendChild(square);
        }

        const fillInterval = setInterval(() => {
            if (currentSquare < numSquares) {
                loadingSquares.children[currentSquare].classList.add('filled');
                playSound('key');
                currentSquare++;
            } else {
                clearInterval(fillInterval);
                document.getElementById('loading-bar').style.display = 'none';
                
                printToTerminal("Access granted. Welcome, user.");
                printToTerminal("Type 'help' or 'cad' to begin.");
                
                document.querySelector('.prompt-line').style.display = 'flex';
                document.getElementById('terminal-input').focus();
                
                // START THE HUD ANIMATION NOW
                startHudAnimation();
            }
        }, 150);
    }

    /* =================================================================== */
    /* 5. TERMINAL LOGIC
    /* =================================================================== */
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.querySelector('.terminal-body');
    let gameRunning = false;

    terminalInput.addEventListener('input', () => playSound('key'));

    terminalInput.addEventListener('keydown', function(event) {
        if (gameRunning) return;
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = terminalInput.value.trim().toLowerCase();
            printToTerminal(`<span class="prompt-user">> GUEST:</span> ${command}`);
            processCommand(command);
            terminalInput.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    function processCommand(command) {
        let response = "";
        const parts = command.split(' ');
        const baseCommand = parts[0];
        const arg = parts[1];

        switch (baseCommand) {
            case 'help':
                response = "Available commands: <br>" +
                           "[cad] - Launch Holographic CAD Viewer <span style='color:#fff'>(NEW!)</span><br>" +
                           "[game] - Play Snake<br>" +
                           "[whoami] - Bio<br>" +
                           "[socials] - Links<br>" +
                           "[resume] - Download PDF<br>" + 
                           "[ls] - Sections<br>" +
                           "[cat projects.txt] - Projects<br>" +
                           "[nav &lt;section&gt;] - Go to page<br>" +
                           "[clear] - Clear<br>" +
                           "[lebron] - The GOAT";
                break;

            case 'cad':
            case 'prototype':
                launchCadViewer();
                return;

            case 'whoami':
                response = "Alistair Westbrook: Freshman ME student @ UNL. Baja SAE member. Builder of Terraflo Analytics.";
                break;

            case 'socials':
                response = "<a href='https://github.com/AlistairWstbrk' target='_blank'>GitHub</a> | <a href='https://www.linkedin.com/in/alistairw' target='_blank'>LinkedIn</a>";
                break;

            case 'resume':
                response = "Downloading resume...";
                const link = document.createElement('a');
                link.href = 'resume.pdf';
                link.download = 'Alistair_Westbrook_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                break;

            case 'ls':
                response = "about  projects  achievements";
                break;
            
            case 'cat':
                if (arg === 'projects.txt') {
                    response = "--- Projects ---<br>" +
                               "* <strong>Terraflo Analytics (AI/Hardware)</strong><br>" +
                               "  An AI-powered hydroponic sensor device.<br>" +
                               "  <a href='https://cornhacks20.vercel.app/' target='_blank'>[View Demo]</a><br><br>" +
                               "* <strong>Differdle.com (Web App)</strong><br>" +
                               "  A calculus-based game for solving derivatives.<br>" +
                               "  <a href='https://Differdle.com' target='_blank'>[Play Game]</a>";
                } else {
                    response = `File not found: "${arg}". Did you mean 'cat projects.txt'?`;
                }
                break;

            case 'nav':
                if (['projects', 'achievements', 'home', 'about'].includes(arg)) {
                    document.getElementById(arg).scrollIntoView({ behavior: 'smooth' });
                    response = `Navigating to /${arg}...`;
                } else {
                    response = `Section not found: "${arg}". Try 'ls'.`;
                }
                break;

            case 'clear':
                const initialMessages = document.querySelectorAll('.terminal-body p');
                for(let i = initialMessages.length - 1; i >= 0; i--) { initialMessages[i].remove(); }
                response = "Terminal cleared.";
                break;

            case 'lebron':
                const img = document.createElement('img');
                img.src = 'lebron.png';
                img.className = 'terminal-image';
                terminalBody.appendChild(img);
                break;

            case 'game':
            case 'snake':
                startGame();
                break;

            default:
                response = `Command not found: "${command}". Type 'help'.`;
                break;
        }
        
        if(response) printToTerminal(response);
    }

    function printToTerminal(message) {
        playSound('success');
        const output = document.createElement('p');
        output.innerHTML = message;
        terminalBody.appendChild(output);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    /* =================================================================== */
    /* 6. HOLOGRAPHIC CAD VIEWER
    /* =================================================================== */
    window.closeCad = function() {
        document.getElementById('cad-overlay').style.display = 'none';
        if (cadAnimationId) cancelAnimationFrame(cadAnimationId);
        printToTerminal("CAD Viewer Terminated.");
    };

    function launchCadViewer() {
        const overlay = document.getElementById('cad-overlay');
        const container = document.getElementById('cad-canvas-container');
        
        overlay.style.display = 'flex';
        container.innerHTML = ''; 

        cadScene = new THREE.Scene();
        cadScene.fog = new THREE.FogExp2(0x000000, 0.05);

        cadCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        cadCamera.position.z = 5;

        cadRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        cadRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(cadRenderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });

        cadMesh = new THREE.Mesh(geometry, material);
        cadScene.add(cadMesh);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        cadScene.add(light);

        animateCad();

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        container.addEventListener('mousedown', (e) => { isDragging = true; });
        container.addEventListener('mouseup', (e) => { isDragging = false; });
        container.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };
                cadMesh.rotation.y += deltaMove.x * 0.01;
                cadMesh.rotation.x += deltaMove.y * 0.01;
            }
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });
    }

    function animateCad() {
        cadAnimationId = requestAnimationFrame(animateCad);
        if(cadMesh) {
            cadMesh.rotation.x += 0.005;
            cadMesh.rotation.y += 0.005;
        }
        cadRenderer.render(cadScene, cadCamera);
    }

    window.addEventListener('resize', () => {
        if(document.getElementById('cad-overlay').style.display !== 'none') {
            const container = document.getElementById('cad-canvas-container');
            cadCamera.aspect = container.clientWidth / container.clientHeight;
            cadCamera.updateProjectionMatrix();
            cadRenderer.setSize(container.clientWidth, container.clientHeight);
        }
    });

    /* =================================================================== */
    /* 7. SYSTEM HUD ANIMATION
    /* =================================================================== */
    function startHudAnimation() {
        const barCad = document.getElementById('bar-cad');
        const barReact = document.getElementById('bar-react');
        const barCpp = document.getElementById('bar-cpp');
        const cpuTemp = document.getElementById('cpu-temp');

        setTimeout(() => { barCad.style.width = "90%"; }, 500);
        setTimeout(() => { barReact.style.width = "75%"; }, 800);
        setTimeout(() => { barCpp.style.width = "85%"; }, 1100);

        setInterval(() => {
            barCad.style.width = (90 + Math.random() * 5 - 2.5) + "%";
            barReact.style.width = (75 + Math.random() * 5 - 2.5) + "%";
            barCpp.style.width = (85 + Math.random() * 5 - 2.5) + "%";

            let temp = 40 + Math.floor(Math.random() * 15);
            cpuTemp.innerText = temp + "°C";
            if (temp > 50) cpuTemp.style.color = "red";
            else cpuTemp.style.color = "var(--text-color)";
        }, 2000);
    }

    /* =================================================================== */
    /* 8. SNAKE GAME LOGIC
    /* =================================================================== */
    let snake = [], food = {}, direction = 'right', nextDirection = 'right', score = 0, gameInterval;

    document.addEventListener('keydown', (e) => {
        if (gameRunning) {
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
            switch(e.key) {
                case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
                case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
                case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
                case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
            }
        }
    });

    function startGame() {
        gameRunning = true;
        score = 0;
        snake = [{x: 10, y: 10}];
        direction = 'right';
        nextDirection = 'right';
        
        const initialMessages = document.querySelectorAll('.terminal-body p');
        for(let i = initialMessages.length - 1; i >= 0; i--) { initialMessages[i].remove(); }

        const board = document.createElement('div');
        board.id = 'snake-board';
        terminalBody.appendChild(board);
        
        const info = document.createElement('p');
        info.id = 'game-info';
        info.innerHTML = "CONTROLS: Arrow Keys. Score: 0";
        terminalBody.appendChild(info);

        terminalInput.blur();
        spawnFood();
        gameInterval = setInterval(updateGame, 100);
    }

    function spawnFood() {
        food = {
            x: Math.floor(Math.random() * 20) + 1,
            y: Math.floor(Math.random() * 20) + 1
        };
        for (let part of snake) {
            if (part.x === food.x && part.y === food.y) spawnFood();
        }
    }

    function updateGame() {
        direction = nextDirection;
        const head = { ...snake[0] };
        if (direction === 'right') head.x++;
        if (direction === 'left') head.x--;
        if (direction === 'up') head.y--; 
        if (direction === 'down') head.y++;

        if (head.x > 20 || head.x < 1 || head.y > 20 || head.y < 1 || snake.some(part => part.x === head.x && part.y === head.y)) {
            endGame();
            return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('game-info').innerHTML = `CONTROLS: Arrow Keys. Score: ${score}`;
            playSound('success');
            spawnFood();
        } else {
            snake.pop();
        }
        drawGame();
    }

    function drawGame() {
        const board = document.getElementById('snake-board');
        if(!board) return;
        board.innerHTML = '';
        snake.forEach(part => {
            const snakeElement = document.createElement('div');
            snakeElement.style.gridRowStart = part.y;
            snakeElement.style.gridColumnStart = part.x;
            snakeElement.classList.add('snake-cell', 'snake-body');
            board.appendChild(snakeElement);
        });
        const foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('snake-cell', 'snake-food');
        board.appendChild(foodElement);
    }

    function endGame() {
        clearInterval(gameInterval);
        gameRunning = false;
        const board = document.getElementById('snake-board');
        if(board) board.remove();
        const info = document.getElementById('game-info');
        if(info) info.remove();
        printToTerminal(`GAME OVER. Final Score: ${score}`);
        printToTerminal("Type 'game' to play again.");
        terminalInput.focus();
    }

}); // End of "DOMContentLoaded"
