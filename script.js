/* =================================================================== */
/* 1. Typed.js Script                         */
/* =================================================================== */

// This looks for the HTML element with the ID 'typed-text'
var options = {
    strings: [
        "Initializing portfolio interface...",
        "Loading hardware projects...",
        "Loading web projects...",
        "Compiling achievements...",
        "Hackathon: 2nd Place...",
        "Access granted."
    ],
    typeSpeed: 40,
    backSpeed: 20,
    loop: false,
    showCursor: true,
};
// This command will no longer fail
var typed = new Typed('#typed-text', options);


/* =================================================================== */
/* 2. particles.js Script                        */
/* (Starfield Config)                           */
/* =================================================================== */

// This looks for the HTML element with the ID 'particles-js'
// This command will no longer fail
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 160,
            "density": { "enable": true, "value_area": 800 }
        },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": {
            "value": 0.8,
            "random": true
        },
        "size": {
            "value": 2,
            "random": true
        },
        "line_linked": { "enable": false },
        "move": {
            "enable": true,
            "speed": 0.5,
            "direction": "bottom",
            "random": false,
            "straight": true,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": false },
            "onclick": { "enable": false },
            "resize": true
        }
    },
    "retina_detect": true
});


/* =================================================================== */
/* 3. three.js Script                          */
/* (NEW Wireframe Object)                      */
/* =================================================================== */

// This looks for the HTML element with the ID 'wireframe-canvas'
const canvas = document.getElementById('wireframe-canvas');
if (canvas) {

    // 1. Scene setup
    // This command will no longer fail
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true // Makes background transparent
    });
    renderer.setSize(300, 300); // Match canvas size

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // 1 = 300/300 aspect ratio
    camera.position.z = 5;

    // 3. Object (Geometry + Material)
    const geometry = new THREE.IcosahedronGeometry(2.5, 0); // A complex shape
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF9500, // Starfield Orange
        wireframe: true
    });

    const wireframe = new THREE.Mesh(geometry, material);
    scene.add(wireframe);

    // 4. Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the object
        wireframe.rotation.x += 0.002;
        wireframe.rotation.y += 0.005;

        renderer.render(scene, camera);
    }

    animate();
}
