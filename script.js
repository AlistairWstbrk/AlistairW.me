/* =================================================================== */
/* 1. NEW Vanta.js Script (Wireframe Landscape) */
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
/* 2. Typed.js Script (No Change) */
/* =================================================================== */
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
var typed = new Typed('#typed-text', options);


/* =================================================================== */
/* 3. three.js Script (Rotating Object - No Change) */
/* =================================================================== */
const canvas = document.getElementById('wireframe-canvas');
if (canvas) {

    // 1. Scene setup
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true // Makes background transparent
    });
    renderer.setSize(300, 300);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // 3. Object (Geometry + Material)
    const geometry = new THREE.IcosahedronGeometry(2.5, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0xFF9500, // Starfield Orange
        wireframe: true
    });

    const wireframe = new THREE.Mesh(geometry, material);
    scene.add(wireframe);

    // 4. Animation loop
    function animate() {
        requestAnimationFrame(animate);
        wireframe.rotation.x += 0.002;
        wireframe.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
}
