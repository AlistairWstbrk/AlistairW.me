/* =================================================================== */
/* RUN ALL SCRIPTS ONCE THE PAGE IS LOADED
/* =================================================================== */
document.addEventListener("DOMContentLoaded", function() {

    /* =================================================================== */
    /* 0. AUDIO SYNTHESIS (THE UPGRADE)
    /* Generates sound effects using the browser's Audio API.
    /* =================================================================== */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(type) {
        // Browser requires user interaction to start audio context
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'key') {
            // Subtle mechanical click for typing
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'success') {
            // Sci-fi "Data Processed" Chime
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
    /* 1. Vanta.js Script (Wireframe Landscape)
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
        color: 0xff9500, // Default Orange
        backgroundColor: 0x0, // Black
        points: 10.00,
        maxDistance: 25.00,
        spacing: 20.00
    });


    /* =================================================================== */
    /* 2. Konami Code Listener (Hacker Mode Easter Egg)
    /* Sequence: Up, Up, Down, Down, Left, Right, Left, Right, b, a
    /* =================================================================== */
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateHackerMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateHackerMode() {
        playSound('success');
        // Update CSS Variables to Matrix Green
        document.documentElement.style.setProperty('--primary-color', '#00ff00');
        document.documentElement.style.setProperty('--text-color', '#00ff00');
        document.documentElement.style.setProperty('--border-color', '#00ff00');
        
        // Update Vanta Background color
        vantaEffect.setOptions({
            color: 0x00ff00,
            backgroundColor: 0x000000
        });
        
        printToTerminal("SYSTEM HACKED. ROOT ACCESS GRANTED.");
    }


    /* =================================================================== */
    /* 3. Typed.js Script (with new Loading Bar)
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
            document.getElementById('loading-bar').style.display = 'block';
            startLoadingBar();
        }
    };
    var typed = new Typed('#typed-text', options);


    /* =================================================================== */
    /* 4. Loading Bar Function
    /* =================================================================== */
    const loadingSquares = document.getElementById('loading-squares');
    const terminalBody = document.querySelector('.terminal-body');
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
                playSound('key'); // Sound effect for loading
                currentSquare++;
            } else {
                clearInterval(fillInterval);
                document.getElementById('loading-bar').style.display = 'none';
                
                printToTerminal("Access granted. Welcome, user.");
                printToTerminal("Type 'help' for a list of commands.");
                
                document.querySelector('.prompt-line').style.display = 'flex';
                document.getElementById('terminal-input').focus();
            }
        }, 150);
    }


    /* =================================================================== */
    /* 5. Terminal Interactivity
    /* =================================================================== */
    const terminalInput = document.getElementById('terminal-input');

    // Add sound to typing
    terminalInput.addEventListener('input', () => {
        playSound('key');
    });

    terminalInput.addEventListener('keydown', function(event) {
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
                           "[help] - Show this message<br>" +
                           "[whoami] - Display user bio<br>" +
                           "[socials] - Display contact links<br>" +
                           "[resume] - Download resume<br>" + 
                           "[ls] - List sections<br>" +
                           "[cat projects.txt] - Show list of projects<br>" +
                           "[nav &lt;section&gt;] - Navigate (e.g., 'nav projects')<br>" +
                           "[clear] - Clear the terminal<br>" +
                           "[lebron] - Show the goat";
                break;
            
            case 'whoami':
                response = "Alistair Westbrook: Freshman Mechanical Engineering student at UNL. Part of the Baja SAE team. I build hardware (like Terraflo Analytics) and software (like Differdle.com).";
                break;
            
            case 'socials':
                response = "--- Contact Links ---<br>" +
                           "<a href='https://github.com/AlistairWstbrk' target='_blank'>GitHub:   github.com/AlistairWstbrk</a><br>" +
                           "<a href='https://www.linkedin.com/in/alistairw' target='_blank'>LinkedIn: www.linkedin.com/in/alistairw</a><br>" +
                           "<a href='mailto:Westbrook.alistair@gmail.com'>Gmail:    Westbrook.alistair@gmail.com</a>";
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
                if (arg === 'projects') {
                    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                    response = "Navigating to /projects...";
                } else if (arg === 'achievements') {
                    document.getElementById('achievements').scrollIntoView({ behavior: 'smooth' });
                    response = "Navigating to /achievements...";
                } else if (arg === 'home') {
                    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                    response = "Navigating to /home...";
                } else if (arg === 'about') {
                    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
                    response = "Navigating to /about...";
                } else {
                    response = `Section not found: "${arg}". Try 'ls' to see sections.`;
                }
                break;

            case 'clear':
                const initialMessages = document.querySelectorAll('.terminal-body p');
                let messagesToKeep = 4;
                for(let i = initialMessages.length - 1; i >= messagesToKeep; i--) {
                    initialMessages[i].remove();
                }
                response = "Terminal cleared.";
                break;

            case 'lebron':
                const img = document.createElement('img');
                img.src = 'lebron.png';
                img.alt = 'LeBron James, the GOAT, in the multiverse';
                img.className = 'terminal-image';
                terminalBody.appendChild(img);
                break;

            default:
                response = `Command not found: "${command}". Type 'help' for options.`;
                break;
        }
        
        if(response) printToTerminal(response);
    }

    // Helper function to print to terminal
    function printToTerminal(message) {
        playSound('success'); // <--- TRIGGER SOUND EFFECT
        const output = document.createElement('p');
        output.innerHTML = message;
        terminalBody.appendChild(output);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

}); // End of "DOMContentLoaded"
