import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Cursor
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

//Scene
const scene = new THREE.Scene();

// //Axes helper
// const axesHelper = new THREE.AxisHelper();
// scene.add(axesHelper);

//Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/7.png");

//Fonts
const fontLoader = new THREE.FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
	const textGeometry = new THREE.TextGeometry("Paramjot", {
		font,
		size: 0.5,
		height: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 4,
	});

	textGeometry.computeBoundingBox();
	// textGeometry.translate(
	// 	-(textGeometry.boundingBox.max.x - 0.02) * 0.5,
	// 	-(textGeometry.boundingBox.max.y - 0.02) * 0.5,
	// 	-(textGeometry.boundingBox.max.z - 0.03) * 0.5
	// );
	textGeometry.center();

	const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
	// const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
	const text = new THREE.Mesh(textGeometry, material);
	scene.add(text);

	console.time("donuts");

	const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
	// const donutMaterial = new THREE.MeshMatcapMaterial({
	// 	matcap: matcapTexture,
	// });

	for (let i = 0; i < 100; ++i) {
		const donut = new THREE.Mesh(donutGeometry, material);

		donut.position.x = (Math.random() - 0.5) * 10;
		donut.position.y = (Math.random() - 0.5) * 10;
		donut.position.z = (Math.random() - 0.5) * 10;

		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;

		// donut.scale.x = Math.random();
		// donut.scale.x = Math.random();
		// donut.scale.x = Math.random(); // wrong way

		const scale = Math.random();
		donut.scale.set(scale, scale, scale);

		scene.add(donut);
	}

	console.timeEnd("donut");
});

//Object

//sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	//Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	//Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

//Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	1,
	1000
);

camera.position.z = 3;
// camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	// canvas: canvas
	canvas,
});

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer.setSize(sizes.width, sizes.height);

// //Clock
const clock = new THREE.Clock();

//Animation
const tick = () => {
	//clock sec
	const elapsedTime = clock.getElapsedTime();

	//Update controls
	controls.update();

	//Renderer
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
