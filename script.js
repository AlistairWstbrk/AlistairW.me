/* =================================================================== */
/* RUN ALL SCRIPTS ONCE THE PAGE IS LOADED
/* =================================================================== */
document.addEventListener("DOMContentLoaded", function() {

    /* =================================================================== */
    /* 1. Vanta.js Script (Wireframe Landscape)
    /* =================================================================== */
    VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff9500, // Your orange
        backgroundColor: 0x0, // Your black
        points: 10.00,
        maxDistance: 25.00,
        spacing: 20.00
    });

    /* =================================================================== */
    /* 2. Typed.js Script (with new Loading Bar)
    /* =================================================================== */
    var options = {
        strings: [
            "Initializing portfolio interface...",
            "Loading modules..."
        ],
        typeSpeed: 40,
        backSpeed: 20,
        loop: false,
        showCursor: true,
        onComplete: function() {
            // When typing is done, show loading bar and start it
            document.getElementById('loading-bar').style.display = 'block';
            startLoadingBar();
        }
    };
    var typed = new Typed('#typed-text', options);

    /* =================================================================== */
    /* 3. NEW Loading Bar Function
    /* =================================================================== */
    const loadingSquares = document.getElementById('loading-squares');
    const terminalBody = document.querySelector('.terminal-body');
    const numSquares = 10;
    let currentSquare = 0;

    function startLoadingBar() {
        // Create empty squares
        for (let i = 0; i < numSquares; i++) {
            const square = document.createElement('span');
            square.className = 'loading-square';
            loadingSquares.appendChild(square);
        }

        // Fill squares one by one
        const fillInterval = setInterval(() => {
            if (currentSquare < numSquares) {
                loadingSquares.children[currentSquare].classList.add('filled');
                currentSquare++;
            } else {
                // Loading finished!
                clearInterval(fillInterval);
                
                // Hide loading bar
                document.getElementById('loading-bar').style.display = 'none';
                
                // Print final messages
                printToTerminal("Access granted. Welcome, user.");
                printToTerminal("Type 'help' for a list of commands.");
                
                // Show interactive prompt
                document.querySelector('.prompt-line').style.display = 'flex';
                document.getElementById('terminal-input').focus();
            }
        }, 150); // Speed of loading (milliseconds)
    }

    /* =================================================================== */
    /* 4. three.js Script (Rotating Object)
    /* =================================================================== */
    const canvas = document.getElementById('wireframe-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(300, 300);
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
        const geometry = new THREE.IcosahedronGeometry(2.5, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF9500, wireframe: true });
        const wireframe = new THREE.Mesh(geometry, material);
        scene.add(wireframe);
        function animate() {
            requestAnimationFrame(animate);
            wireframe.rotation.x += 0.002;
            wireframe.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();
    }

    /* =================================================================== */
    /* 5. Terminal Interactivity
    /* =================================================================== */
    const terminalInput = document.getElementById('terminal-input');

    terminalInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = terminalInput.value.trim().toLowerCase();
            
            // Echo user's command
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
                           "[help] - Show this message<br>" +
                           "[ls] - List sections<br>" +
                           "[nav &lt;section&gt;] - Navigate (e.g., 'nav projects')<br>" +
                           "[clear] - Clear the terminal";
                break;
            case 'ls':
                response = "projects  achievements";
                break;
            case 'nav':
                if (arg === 'projects') {
                    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                    response = "Navigating to /projects...";
                } else if (arg === 'achievements') {
                    document.getElementById('achievements').scrollIntoView({ behavior: 'smooth' });
                    response = "Navigating to /achievements...";
                } else if (arg === 'home') {
                    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                    response = "Navigating to /home...";
                } else {
                    response = `Section not found: "${arg}". Try 'ls' to see sections.`;
                }
                break;
            case 'clear':
                // Clear all children except the first few (boot sequence + typed.js)
                const initialMessages = document.querySelectorAll('.terminal-body p');
                let messagesToKeep = 4;
                for(let i = initialMessages.length - 1; i >= messagesToKeep; i--) {
                    initialMessages[i].remove();
                }
                response = "Terminal cleared.";
                break;
            default:
                response = `Command not found: "${command}". Type 'help' for options.`;
                break;
        }
        
        if(response) printToTerminal(response);
    }

    // Helper function to print to terminal
    function printToTerminal(message) {
        const output = document.createElement('p');
        output.innerHTML = message;
        terminalBody.appendChild(output);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

}); // End of "DOMContentLoaded"
