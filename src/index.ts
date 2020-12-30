import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  GridHelper,
  AmbientLight,
  TextureLoader,
  Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import { FireworkManager } from "./firework";

import textureUrl from "./assets/particle.png";
import "./assets/style.css";

const canvas = document.getElementById("background") as HTMLCanvasElement;
const renderer = new WebGLRenderer({ antialias: true, canvas });
// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
camera.position.set(0, 3, 15);
const scene = new Scene();

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 2, 0, 0);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const controlElement = document.getElementById("front")!;
const controls = new OrbitControls(camera, controlElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.target.set(0, 3, 0);

const grid = new GridHelper(15, 20, 0xddaa00, 0xddaa00);
scene.add(grid);

const ambientLight = new AmbientLight(0x606060);
scene.add(ambientLight);

const texture = new TextureLoader().load(textureUrl);
const fireworkManager = new FireworkManager(texture, scene);

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  fireworkManager.update();
  renderer.render(scene, camera);
  composer.render();
};

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false,
);
animate();
