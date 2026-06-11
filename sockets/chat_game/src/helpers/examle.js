//================================
// файл с примерами кода
//================================
import * as THREE from 'three';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // добавление канваса

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(15, 15, 15);
scene.add(light);
scene.add(camera);
camera.position.z = 25

const geometry = new THREE.SphereGeometry(5, 5, 5);
const material = new THREE.MeshStandardMaterial({color: 0xffffff});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
