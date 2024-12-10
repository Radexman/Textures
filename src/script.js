import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

// Textures
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
	console.log('onStart');
};

loadingManager.onLoad = () => {
	console.log('onLoad');
};

loadingManager.onProgress = () => {
	console.log('onProgress');
};

loadingManager.onError = () => {
	console.log('onError');
};

const textureLoader = new THREE.TextureLoader(loadingManager);

// Color Texture
const colorTexture = textureLoader.load('/textures/door/color.jpg');
colorTexture.colorSpace = THREE.SRGBColorSpace;

// Alpha Texture
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
alphaTexture.colorSpace = THREE.SRGBColorSpace;

// Height Texture
const heightTexture = textureLoader.load('/textures/door/height.jpg');
heightTexture.colorSpace = THREE.SRGBColorSpace;

// Normal Texture
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
normalTexture.colorSpace = THREE.SRGBColorSpace;

// Ambient Occlusion Texture
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
ambientOcclusionTexture.colorSpace = THREE.SRGBColorSpace;

// Metalness Texture
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
metalnessTexture.colorSpace = THREE.SRGBColorSpace;

// Roughness Texture
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
roughnessTexture.colorSpace = THREE.SRGBColorSpace;

colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;

// Debug UI
const gui = new GUI({
	width: 330,
	title: 'Debug UI',
});

// Toggle UI on "G" keydown event
window.addEventListener('keydown', (event) => {
	if (event.key === 'g') {
		gui.show(gui._hidden);
	}
});

// GUI Object
const guiObject = {
	color: '#ff0000',
	spinning: true,
	spinSpeed: 6,
	spinX: () => {
		gsap.to(mesh.rotation, {
			duration: 2,
			x: mesh.rotation.x + Math.PI * 2,
		});
	},
	spinY: () => {
		gsap.to(mesh.rotation, {
			duration: 2,
			y: mesh.rotation.y + Math.PI * 2,
		});
	},
	spinZ: () => {
		gsap.to(mesh.rotation, {
			duration: 2,
			z: mesh.rotation.z + Math.PI * 2,
		});
	},
	rotateY: () => {
		gsap.to(mesh.rotation, {
			duration: 2,
			y: mesh.rotation.y + Math.PI * 2,
			repeat: -1,
			ease: 'none',
		});
	},
};

// Base

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ map: colorTexture, wireframe: false });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI folders
const axesTweaks = gui.addFolder('Axes');
const spinTweaks = gui.addFolder('Spins');
const rotateTweaks = gui.addFolder('Rotations');
const otherTweaks = gui.addFolder('Other');

// GUI tweaks
axesTweaks.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('x axis');
axesTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y axis');
axesTweaks.add(mesh.position, 'z').min(-3).max(1).step(0.01).name('z axis');
spinTweaks.add(guiObject, 'spinX').name('spin x');
spinTweaks.add(guiObject, 'spinY').name('spin y');
spinTweaks.add(guiObject, 'spinZ').name('spin z');
rotateTweaks.add(guiObject, 'spinning').name('rotate y');
rotateTweaks.add(guiObject, 'spinSpeed').min(1).max(12).step(1).name('rotate speed');
otherTweaks.add(material, 'wireframe');
otherTweaks.addColor(guiObject, 'color').onChange(() => material.color.set(guiObject.color));

// Sizes
const sizes = {
	width: innerWidth,
	height: innerHeight,
};

// Resizing
window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = innerWidth;
	sizes.height = innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

// Toggle fullscreen
window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

// Keep track of the previous frame time
let previousTime = 0;

// Store the current Y rotation manually
let currentRotationY = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Time difference between frames
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Spin animation
	if (guiObject.spinning) {
		// Increment rotation based on spin speed and deltaTime
		currentRotationY += (Math.PI / guiObject.spinSpeed) * deltaTime;
		mesh.rotation.y = currentRotationY;
	}

	// Render
	renderer.render(scene, camera);

	// Update controls
	controls.update();

	// Call tick again on the next frame
	requestAnimationFrame(tick);
};

tick();
