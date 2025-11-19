/* =================================================================== */
/* RUN ALL SCRIPTS ONCE THE PAGE IS LOADED
/* =================================================================== */
document.addEventListener("DOMContentLoaded", function() {

    /* --- GLOBAL VARIABLES --- */
    let cadRenderer, cadScene, cadCamera, cadAnimationId;
    let cadMesh;
    let typedInstance;     
    let loadingInterval;   

    /* =================================================================== */
    /* 0. SKIP INTRO FUNCTION
    /* =================================================================== */
    window.skipIntro = function() {
        if (typedInstance) typedInstance.destroy();
        if (loadingInterval) clearInterval(loadingInterval);

        document.getElementById('typed-text').innerHTML = "Access granted.";
        document.getElementById('loading-bar').style.display = 'none';
        document.getElementById('skip-btn').style.display = 'none';

        const terminalBody = document.querySelector('.terminal-body');
        const oldPs = terminalBody.querySelectorAll('p');
        const welcome = document.createElement('p');
        welcome.innerHTML = "Welcome, user.";
        terminalBody.appendChild(welcome);

        const helpMsg = document.createElement('p');
        helpMsg.innerHTML = "Type 'help' to view commands.";
        terminalBody.appendChild(helpMsg);

        document.querySelector('.prompt-line').style.display = 'flex';
        document.getElementById('terminal-input').focus();
    };

    /* =================================================================== */
    /* 1. CAD FILE REGISTRY
    /* =================================================================== */
    const cadFiles = {
        'gnome': { 
            file: 'project.stl', 
            description: 'Just a cute little gnome, nothing too special' 
        },
        'enclosure': { 
            file: 'terracase.stl', 
            description: 'Terraflo enclosure made as a prototype case to show off at cornhacks, it was too tight for the pcb.' 
        },
        // Add more files here as needed
    };

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
        } else if (!gameRunning) { konamiIndex = 0; }
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
    typedInstance = new Typed('#typed-text', options);

    const loadingSquares = document.getElementById('loading-squares');
    const numSquares = 10;
    let currentSquare = 0;

    function startLoadingBar() {
        for (let i = 0; i < numSquares; i++) {
            const square = document.createElement('span');
            square.className = 'loading-square';
            loadingSquares.appendChild(square);
        }
        loadingInterval = setInterval(() => {
            if (currentSquare < numSquares) {
                loadingSquares.children[currentSquare].classList.add('filled');
                currentSquare++;
            } else {
                clearInterval(loadingInterval);
                document.getElementById('loading-bar').style.display = 'none';
                document.getElementById('skip-btn').style.display = 'none';
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
        const arg = parts[1];

        switch (baseCommand) {
            case 'help':
                response = "Available commands: <br>" +
                           "[cad] - View 3D files <span style='color:#fff'>(UPDATED)</span><br>" +
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
                if (!arg) {
                    let fileList = "--- Available CAD Files ---<br>";
                    for (const [key, data] of Object.entries(cadFiles)) {
                        fileList += `[${key}] - ${data.description}<br>`;
                    }
                    response = fileList;
                } else if (cadFiles[arg]) {
                    launchCadViewer(cadFiles[arg].file);
                    return; 
                } else {
                    response = `File '${arg}' not found. Type 'cad' for list.`;
                }
                break;

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

            case 'ls': response = "about  projects  achievements"; break;
            
            case 'cat':
                if (arg === 'projects.txt') {
                    response = "--- Projects ---<br>" +
                               "* <strong>Terraflo Analytics (AI/Hardware)</strong><br>" +
                               "* <strong>Differdle.com (Web App)</strong>";
                } else {
                    response = `File not found: "${arg}". Did you mean 'cat projects.txt'?`;
                }
                break;

            case 'nav':
                if (['projects', 'achievements', 'home', 'about'].includes(arg)) {
                    document.getElementById(arg).scrollIntoView({ behavior: 'smooth' });
                    response = `Navigating to /${arg}...`;
                } else {
                    response = `Section not found.`;
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
    /* 6. HOLOGRAPHIC CAD VIEWER (With Wireframe Toggle)
    /* =================================================================== */
    window.closeCad = function() {
        document.getElementById('cad-overlay').style.display = 'none';
        if (cadAnimationId) cancelAnimationFrame(cadAnimationId);
        printToTerminal("CAD Viewer Terminated.");
    };

    // === NEW TOGGLE FUNCTION ===
    window.toggleWireframe = function() {
        if(cadMesh && cadMesh.material) {
            // Invert the wireframe boolean
            cadMesh.material.wireframe = !cadMesh.material.wireframe;
        }
    };

    function launchCadViewer(filename) {
        const overlay = document.getElementById('cad-overlay');
        const container = document.getElementById('cad-canvas-container');
        const controlText = document.getElementById('cad-title-text');
        
        overlay.style.display = 'flex';
        container.innerHTML = ''; 
        controlText.innerText = `VIEWING: ${filename.toUpperCase()}`;

        // Setup Scene
        cadScene = new THREE.Scene();
        cadScene.background = new THREE.Color(0x111111); 

        cadCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

        cadRenderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
        cadRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(cadRenderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        cadScene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(50, 50, 100);
        cadScene.add(dirLight);
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-50, 50, -100);
        cadScene.add(backLight);

        // Loader
        const loader = new THREE.STLLoader();
        printToTerminal(`Loading ${filename}...`);
        
        loader.load(filename, function (geometry) {
            geometry.computeBoundingBox();
            geometry.center(); 

            const boundingBox = geometry.boundingBox;
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scaleFactor = 10 / maxDim;

            const material = new THREE.MeshStandardMaterial({ 
                color: 0xaaaaaa, 
                roughness: 0.5, 
                metalness: 0.5, 
                side: THREE.DoubleSide,
                wireframe: false // Start solid
            });
            cadMesh = new THREE.Mesh(geometry, material);
            
            cadMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
            cadMesh.rotation.x = -Math.PI / 2; 

            cadScene.add(cadMesh);
            
            cadCamera.position.set(0, 5, 20);
            cadCamera.lookAt(0, 0, 0);

            printToTerminal("Model loaded.");
        }, undefined, (err) => { console.error(err); printToTerminal("Error loading file."); });

        animateCad();

        // Mouse Rotation
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        container.addEventListener('mousedown', () => { isDragging = true; });
        container.addEventListener('mouseup', () => { isDragging = false; });
        container.addEventListener('mousemove', (e) => {
            if (isDragging && cadMesh) {
                const deltaMove = { x: e.offsetX - previousMousePosition.x, y: e.offsetY - previousMousePosition.y };
                cadMesh.rotation.z -= deltaMove.x * 0.01;
                cadMesh.rotation.x -= deltaMove.y * 0.01;
                document.getElementById('rot-val').innerText = 
                    `${cadMesh.rotation.x.toFixed(1)}, ${cadMesh.rotation.y.toFixed(1)}, ${cadMesh.rotation.z.toFixed(1)}`;
            }
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });
    }

    function animateCad() {
        cadAnimationId = requestAnimationFrame(animateCad);
        if(cadMesh) cadMesh.rotation.z += 0.002;
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
            if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) e.preventDefault();
            switch(e.key) {
                case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
                case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
                case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
                case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
            }
        }
    });
    function startGame() {
        gameRunning = true; score = 0; snake = [{x: 10, y: 10}]; direction = 'right'; nextDirection = 'right';
        const initialMessages = document.querySelectorAll('.terminal-body p');
        for(let i = initialMessages.length - 1; i >= 0; i--) { initialMessages[i].remove(); }
        const board = document.createElement('div'); board.id = 'snake-board'; terminalBody.appendChild(board);
        const info = document.createElement('p'); info.id = 'game-info'; info.innerHTML = "CONTROLS: Arrow Keys. Score: 0"; terminalBody.appendChild(info);
        terminalInput.blur(); spawnFood(); gameInterval = setInterval(updateGame, 100);
    }
    function spawnFood() {
        food = { x: Math.floor(Math.random() * 20) + 1, y: Math.floor(Math.random() * 20) + 1 };
        for (let part of snake) { if (part.x === food.x && part.y === food.y) spawnFood(); }
    }
    function updateGame() {
        direction = nextDirection; const head = { ...snake[0] };
        if (direction === 'right') head.x++; if (direction === 'left') head.x--; if (direction === 'up') head.y--; if (direction === 'down') head.y++;
        if (head.x > 20 || head.x < 1 || head.y > 20 || head.y < 1 || snake.some(part => part.x === head.x && part.y === head.y)) { endGame(); return; }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) { score += 10; document.getElementById('game-info').innerHTML = `CONTROLS: Arrow Keys. Score: ${score}`; spawnFood(); } 
        else { snake.pop(); }
        drawGame();
    }
    function drawGame() {
        const board = document.getElementById('snake-board'); if(!board) return; board.innerHTML = '';
        snake.forEach(part => { const el = document.createElement('div'); el.style.gridRowStart = part.y; el.style.gridColumnStart = part.x; el.classList.add('snake-cell', 'snake-body'); board.appendChild(el); });
        const f = document.createElement('div'); f.style.gridRowStart = food.y; f.style.gridColumnStart = food.x; f.classList.add('snake-cell', 'snake-food'); board.appendChild(f);
    }
    function endGame() {
        clearInterval(gameInterval); gameRunning = false;
        const board = document.getElementById('snake-board'); if(board) board.remove();
        const info = document.getElementById('game-info'); if(info) info.remove();
        printToTerminal(`GAME OVER. Final Score: ${score}`); printToTerminal("Type 'game' to play again."); terminalInput.focus();
    }

}); // End of "DOMContentLoaded"
