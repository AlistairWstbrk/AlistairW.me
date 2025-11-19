/* =================================================================== */
/* RUN ALL SCRIPTS ONCE THE PAGE IS LOADED
/* =================================================================== */
document.addEventListener("DOMContentLoaded", function() {

    /* =================================================================== */
    /* 1. CAD FILE REGISTRY (EDIT THIS LIST!)
    /* =================================================================== */
    const cadFiles = {
        // 'command_name': { file: 'actual_file.stl', description: 'Description for list' }
        'enclosure': { 
            file: 'project.stl', 
            description: 'Terraflo Main Enclosure (v2)' 
        },
        'chassis': { 
            file: 'chassis.stl', // Make sure you have this file if you use it
            description: 'Baja SAE Front Suspension' 
        },
        'mount': { 
            file: 'sensor_mount.stl', 
            description: '3D Printed Sensor Bracket' 
        }
    };

    /* --- GLOBAL VARIABLES FOR CAD --- */
    let cadRenderer, cadScene, cadCamera, cadAnimationId;
    let cadMesh;

    /* =================================================================== */
    /* 2. Vanta.js Script
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
        color: 0xff9500, // Orange
        backgroundColor: 0x0, // Black
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
                currentSquare++;
            } else {
                clearInterval(fillInterval);
                document.getElementById('loading-bar').style.display = 'none';
                
                printToTerminal("Access granted. Welcome, user.");
                printToTerminal("Type 'help' to view commands.");
                
                document.querySelector('.prompt-line').style.display = 'flex';
                document.getElementById('terminal-input').focus();
            }
        }, 150);
    }

    /* =================================================================== */
    /* 5. TERMINAL LOGIC
    /* =================================================================== */
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.querySelector('.terminal-body');
    let gameRunning = false;

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
        const arg = parts[1]; // This is the file name they type (e.g., "enclosure")

        switch (baseCommand) {
            case 'help':
                response = "Available commands: <br>" +
                           "[cad] - List or view 3D files <span style='color:#fff'>(UPDATED)</span><br>" +
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

            // === UPDATED CAD COMMAND ===
            case 'cad':
                if (!arg) {
                    // No argument? List available files
                    let fileList = "--- Available CAD Files ---<br>";
                    fileList += "Usage: 'cad [name]' to load a file.<br><br>";
                    
                    for (const [key, data] of Object.entries(cadFiles)) {
                        fileList += `[${key}] - ${data.description}<br>`;
                    }
                    response = fileList;
                } 
                else if (cadFiles[arg]) {
                    // Argument exists and matches a file? Load it!
                    launchCadViewer(cadFiles[arg].file);
                    return; // Exit so we don't print response
                } 
                else {
                    // Argument exists but doesn't match
                    response = `File '${arg}' not found in registry.<br>Type 'cad' to see available files.`;
                }
                break;
            // ===========================

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
        const output = document.createElement('p');
        output.innerHTML = message;
        terminalBody.appendChild(output);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    /* =================================================================== */
    /* 6. HOLOGRAPHIC CAD VIEWER (FIXED LIGHTING & LOADING)
    /* =================================================================== */
    window.closeCad = function() {
        document.getElementById('cad-overlay').style.display = 'none';
        if (cadAnimationId) cancelAnimationFrame(cadAnimationId);
        printToTerminal("CAD Viewer Terminated.");
    };

    function launchCadViewer(filename) {
        const overlay = document.getElementById('cad-overlay');
        const container = document.getElementById('cad-canvas-container');
        const controlText = document.querySelector('#cad-controls span');
        
        overlay.style.display = 'flex';
        container.innerHTML = ''; 
        controlText.innerText = `VIEWING: ${filename.toUpperCase()}`;

        cadScene = new THREE.Scene();
        // Dark grey background for better visibility
        cadScene.background = new THREE.Color(0x111111);

        // Camera Setup
        cadCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        cadCamera.position.z = 100; 
        cadCamera.position.y = 50;

        cadRenderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
        cadRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(cadRenderer.domElement);

        // === LIGHTING SETUP (Crucial for preventing Black STL) ===
        // 1. Ambient Light (General soft light)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        cadScene.add(ambientLight);

        // 2. Directional Light (Sun-like shadow caster)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(50, 50, 100);
        cadScene.add(dirLight);
        
        // 3. Backlight (To see the other side)
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-50, 50, -100);
        cadScene.add(backLight);

        // === LOAD THE STL FILE ===
        const loader = new THREE.STLLoader();
        
        printToTerminal(`Loading ${filename}... please wait.`);
        
        loader.load(
            filename, 
            function (geometry) {
                geometry.center();

                // === MATERIAL SETUP (The "Black Fix") ===
                // MeshStandardMaterial reacts to light. 
                // color: 0xaaaaaa is a nice "Tech Grey"
                // metalness/roughness makes it look like metal or plastic
                const material = new THREE.MeshStandardMaterial({ 
                    color: 0xaaaaaa, 
                    roughness: 0.5,
                    metalness: 0.5,
                    side: THREE.DoubleSide
                });

                cadMesh = new THREE.Mesh(geometry, material);
                
                // SCALE ADJUSTMENT
                // Adjust this if your model is still too big/small
                cadMesh.scale.set(0.5, 0.5, 0.5); 
                
                // Fix Rotation
                cadMesh.rotation.x = -Math.PI / 2;

                cadScene.add(cadMesh);
                printToTerminal("Model loaded successfully.");
            },
            (xhr) => {
                // Optional loading progress
            },
            (error) => {
                console.error("Error loading STL:", error);
                printToTerminal(`ERROR: Could not load ${filename}. Check file name.`);
            }
        );

        animateCad();

        // Mouse Rotation
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        container.addEventListener('mousedown', (e) => { isDragging = true; });
        container.addEventListener('mouseup', (e) => { isDragging = false; });
        container.addEventListener('mousemove', (e) => {
            if (isDragging && cadMesh) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };
                cadMesh.rotation.z -= deltaMove.x * 0.01;
                cadMesh.rotation.x -= deltaMove.y * 0.01;
            }
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });
    }

    function animateCad() {
        cadAnimationId = requestAnimationFrame(animateCad);
        if(cadMesh) {
            cadMesh.rotation.z += 0.002; // Auto rotate
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
    /* 7. SNAKE GAME LOGIC
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
