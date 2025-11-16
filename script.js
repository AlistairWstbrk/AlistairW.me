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
/* 2. Typed.js Script (with new onComplete)
/* =================================================================== */
var options = {
    strings: [
        "Initializing portfolio interface...",
        "Loading hardware projects...",
        "Loading web projects...",
        "Compiling achievements...",
        "Hackathon: 2nd Place...",
        "Access granted. Welcome, user.",
        "Type 'help' for a list of commands."
    ],
    typeSpeed: 40,
    backSpeed: 20,
    loop: false,
    showCursor: true,
    onComplete: function() {
        // When typing is done, show the prompt and focus the input
        document.querySelector('.prompt-line').style.display = 'flex';
        document.getElementById('terminal-input').focus();
    }
};
var typed = new Typed('#typed-text', options);


/* =================================================================== */
/* 3. three.js Script (Rotating Object - No Change)
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
/* 4. NEW: Terminal Interactivity
/* =================================================================== */
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.querySelector('.terminal-body');

// Listen for the "Enter" key
terminalInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Stop the default form submit
        
        const command = terminalInput.value.trim().toLowerCase(); // Get command
        
        // 1. Echo user's command
        const echo = document.createElement('p');
        echo.innerHTML = `<span class="prompt-user">> GUEST:</span> ${command}`;
        terminalBody.appendChild(echo);
        
        // 2. Process command
        processCommand(command);
        
        // 3. Clear input
        terminalInput.value = '';
        
        // 4. Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

function processCommand(command) {
    let response = "";
    
    // Split command for arguments (e.g., "nav projects")
    const parts = command.split(' ');
    const baseCommand = parts[0];
    const arg = parts[1];

    switch (baseCommand) {
        case 'help':
            response = "Available commands: <br>" +
                       "[help] - Show this message<br>" +
                       "[ls] - List sections<br>" +
                       "[nav &lt;section&gt;] - Navigate to a section (e.g., 'nav projects')<br>" +
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
            // Clear all children except the first few (boot sequence)
            const initialMessages = document.querySelectorAll('.terminal-body p');
            let messagesToKeep = 5; // Keep boot messages + typed.js span
            initialMessages.forEach((p, index) => {
                if (index >= messagesToKeep) {
                    p.remove();
                }
            });
            response = "Terminal cleared. Welcome message restored.";
            break;
            
        default:
            response = `Command not found: "${command}". Type 'help' for options.`;
            break;
    }
    
    // Print the response
    const output = document.createElement('p');
    output.innerHTML = response;
    terminalBody.appendChild(output);
}
