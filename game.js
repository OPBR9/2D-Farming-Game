import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0);
scene.add(player);

const crops = [];
const cropTypes = {
    wheat: { color: 0xffd700 },
    corn: { color: 0xffff00 },
    carrot: { color: 0xff8c00 }
};

function plantCrop(type, x, z) {
    const cropGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
    const cropMaterial = new THREE.MeshStandardMaterial({ color: cropTypes[type].color });
    const crop = new THREE.Mesh(cropGeometry, cropMaterial);
    crop.position.set(x, 0.5, z);
    scene.add(crop);
    crops.push({ mesh: crop, type, stage: 0 });
}

let money = 100;
const seeds = { wheat: 0, corn: 0, carrot: 0 };

function buySeed(type) {
    if (money >= 5) {
        money -= 5;
        seeds[type]++;
        console.log(`${type} seed bought!`);
    }
}

document.addEventListener("click", (event) => {
    const x = Math.floor(player.position.x);
    const z = Math.floor(player.position.z);
    if (seeds.wheat > 0) {
        plantCrop("wheat", x, z);
        seeds.wheat--;
    }
});

camera.position.set(0, 5, 10);
camera.lookAt(player.position);

const keys = {};
document.addEventListener("keydown", (event) => keys[event.key] = true);
document.addEventListener("keyup", (event) => keys[event.key] = false);

function animate() {
    requestAnimationFrame(animate);
    
    if (keys["ArrowUp"]) player.position.z -= 0.1;
    if (keys["ArrowDown"]) player.position.z += 0.1;
    if (keys["ArrowLeft"]) player.position.x -= 0.1;
    if (keys["ArrowRight"]) player.position.x += 0.1;
    
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10;
    camera.lookAt(player.position);
    
    renderer.render(scene, camera);
}

animate();
