// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111122);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 1, 1);
scene.add(light1);
scene.add(new THREE.AmbientLight(0x404040));

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.z = 50;

// Model loader
let mixer, model;
const loader = new THREE.GLTFLoader();
loader.load(
  'rna_pol_I.glb',
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    
    // Animation setup
    mixer = new THREE.AnimationMixer(model);
    const clip = gltf.animations[0];
    const action = mixer.clipAction(clip);
    action.play();
  },
  undefined,
  (error) => console.error(error)
);

// Click interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    const part = intersects[0].object.parent.name || "RNA Polymerase I";
    document.getElementById('info').textContent = `Clicked: ${part}`;
  }
});

// Play/pause with spacebar
let isPlaying = true;
window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    isPlaying = !isPlaying;
    mixer.timeScale = isPlaying ? 1.0 : 0.0;
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.016); // Update animation
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});