import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  BlendFunction,
} from "postprocessing";

export const vizAnimation = (WIDTH, HEIGHT) => {
  const POS_X = 1800;
  const POS_Y = 500;
  const POS_Z = WIDTH <= 1440 ? 1200 : 600;
  const FOV = 50;
  const NEAR = 1;
  const FAR = 10000;

  // Scene Loader Obj for Improved Loading UX
  //   Scene.sceneLoader = {
  //     skybox: null,
  //     spotlight: null,
  //     ambient: null,
  //     world: null,
  //     sky: null,
  //     data: null,
  //   };

  // mobile check and touch check
  //this.touch = "ontouchstart" in document.documentElement ? true : false;

  // SCENE
  const Scene = new THREE.Scene();

  // CAMERA
  Scene.camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
  Scene.camera.position.z = 4;
  Scene.camera.name = "camera";

  Scene.camera.position.set(POS_X, POS_Y, POS_Z);
  Scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
  Scene.scene.add(Scene.camera);

  // RENDERER
  Scene.renderer = new THREE.WebGLRenderer({ antialias: true });
  Scene.renderer.setClearColor(0x000000);
  Scene.renderer.setSize(WIDTH, HEIGHT);
  Scene.renderer.domElement.id = "vizCanvas";
  Scene.mount.appendChild(Scene.renderer.domElement);

  // LOADER
  Scene.loader = new THREE.TextureLoader();
  Scene.loader.setPath("@/assets/");

  // OBJECTS
  Scene.cloudObj = new THREE.Object3D();
  Scene.cloudObj.name = "cloud";
  Scene.worldObj = new THREE.Object3D();
  Scene.worldObj.name = "world";
  Scene.dataArray = [];

  // GEOMETRY
  Scene.spGeo = new THREE.SphereBufferGeometry(600, 50, 50);

  // CLOCK
  Scene.clock = new THREE.Clock();

  // CONTROLS
  Scene.controls = new OrbitControls(Scene.camera);
  Scene.controls.enableZoom = true;
  Scene.controls.enablePan = false;
  Scene.controls.minDistance = 1000;
  Scene.controls.maxDistance = 2800;

  // EFFECTS
  const bloom = new BloomEffect({
    blendFunction: BlendFunction.SCREEN,
    resolutionScale: 1.0,
    distinction: 1.0,
    opacity: 4.0,
  });
  const effectsPass = new EffectPass(Scene.camera, bloom);

  effectsPass.renderToScreen = true;

  Scene.composer = new EffectComposer(Scene.renderer);
  Scene.composer.setSize(WIDTH, HEIGHT);
  Scene.composer.addPass(new RenderPass(Scene, Scene.camera));
  Scene.composer.addPass(effectsPass);

  // HELPERS
  Scene.handleVizResize = (newWidth, newHeight) => {
    Scene.camera.aspect = newWidth / newHeight;
    Scene.camera.updateProjectionMatrix();
    Scene.renderer.setSize(newWidth, newHeight);
  };

  Scene.handleZoom = (e) => {
    Scene.controls.enableZoom = e.type === "mouseenter" ? false : true;
  };

  // FUNCS
  Scene.start = () => {
    Scene.frameId = requestAnimationFrame(Scene.animate);
  };

  Scene.startPreloader = () => {
    Scene.preloaderFrameId = requestAnimationFrame(Scene.animatePreloader);
  };

  Scene.stop = () => {
    cancelAnimationFrame(Scene.frameId);
  };

  Scene.stopPreloader = () => {
    cancelAnimationFrame(Scene.preloaderFrameId);
  };

  Scene.animatePreloader = () => {
    Scene.getObjectByName("preloaderGlobe").rotation.y += 0.001;
    Scene.composer.render(Scene.clock.getDelta());
    Scene.preloaderFrameId = window.requestAnimationFrame(
      Scene.animatePreloader
    );
  };

  Scene.addData = (threeData, feedIndex) => {
    // Quake Lines rendered SSR and stored in mem
    const objLoader = new THREE.ObjectLoader();

    Scene.dataArray[0] = threeData[0] !== null ? objLoader.parse(threeData[0]) : null;
    Scene.dataArray[1] = threeData[1] !== null ? objLoader.parse(threeData[1]) : null;
    Scene.dataArray[2] = threeData[2] !== null ? objLoader.parse(threeData[2]) : null;
    Scene.dataArray[3] = threeData[3] !== null ? objLoader.parse(threeData[3]) : null;

    Scene.sceneLoader.data = Scene.dataArray[feedIndex];
  }

  // TODO: Test using direct access vs getObjectByName helper

  // Zoom to Selected Quake
  Scene.cameraToQuake = ({
    setAutoRotation,
    selectedQuakeIndex,
    quakes,
    feedIndex,
  }) => {
    // console.log("cameraToQuake");
    setAutoRotation(false);
    const altitude = 1400;
    const coeff = 1 + altitude / 600;
    const selectedQuake = quakes[feedIndex][selectedQuakeIndex];
    const { magnitude, coordinates } = selectedQuake;
    const quakeVector = longLatToSphere(coordinates[0], coordinates[1], 600);
    //
    const { x, y, z } = quakeVector;
    const quakeVectorX = x * -coeff;
    const quakeVectorY = y * coeff;
    const quakeVectorZ = z * -coeff;
    //
    const zoomToQuake = new TWEEN.Tween(
      Scene.getObjectByName("camera").position
    )
      .to({ x: -quakeVectorX, y: quakeVectorY, z: -quakeVectorZ }, 2000)
      .onUpdate(() => {
        Scene.camera.lookAt(Scene.getObjectByName("world").position);
      });
    const worldUnrotate = new TWEEN.Tween(Scene.worldObj.rotation).to(
      { x: 0, y: 0, z: 0 },
      0
    );

    Scene.addSelectedQuake(magnitude, x, y, z);
    worldUnrotate.start();
    zoomToQuake.start();
  };

  // TODO: Ensure Props Passed Update
  Scene.animate = ({ autoRotation, selectedQuake }) => {
    if (autoRotation && !selectedQuake) {
      Scene.worldObj.rotation.y += 0.001;
      Scene.cloudObj.rotation.y += 0.0014;
      Scene.spotlight.position.set(
        Scene.camera.position.x,
        Scene.camera.position.y,
        Scene.camera.position.z
      );
      Scene.composer.render(Scene.clock.getDelta());
    } else if (!autoRotation && selectedQuake) {
      Scene.cloudObj.rotation.y += 0.0004;
      Scene.spotlight.position.set(
        Scene.camera.position.x,
        Scene.camera.position.y,
        Scene.camera.position.z
      );
      Scene.composer.render(Scene.clock.getDelta());
    } else if (autoRotation && selectedQuake) {
      Scene.worldObj.rotation.y += 0.001;
      Scene.cloudObj.rotation.y += 0.0014;
      Scene.spotlight.position.set(
        Scene.camera.position.x,
        Scene.camera.position.y,
        Scene.camera.position.z
      );
      Scene.composer.render(Scene.clock.getDelta());
    } else {
      Scene.cloudObj.rotation.y += 0.0004;
      Scene.spotlight.position.set(
        Scene.camera.position.x,
        Scene.camera.position.y,
        Scene.camera.position.z
      );
      Scene.composer.render(Scene.clock.getDelta());
    }

    TWEEN.update();
    Scene.frameId = window.requestAnimationFrame(Scene.animate);
  };

  // CALLS/INIT
  Scene.addPreloaderGlobe();
  Scene.startPreloader();
  Scene.addLights();
  Scene.addCore();
  Scene.addEarth();
  Scene.addClouds();
  Scene.addSkybox();
  Scene.addData();
  Scene.sceneLoaderInit();

  return Scene;
};

const colorData = (percentage) => {
  let rgbString = "",
    r = parseInt(percentage * 25.5),
    g = 255 - r;

  r = r < 0 ? 0 : r;
  rgbString = `rgb(${r},${g}, 0)`;
  return rgbString;
};

const longLatToSphere = (long, lat, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

export const delay = () => {
  let timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
};
