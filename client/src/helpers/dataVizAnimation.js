import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import * as OrbitControls from "three-orbitcontrols";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  BlendFunction,
} from "postprocessing";
import { setModalText } from "@/redux/reducers/modalSlice.js";
import { setVizTextureRendered } from "@/redux/reducers/vizSlice.js";
import {
  setAutoRotation,
  setSimulationGlobe,
} from "@/redux/reducers/optionSlice.js";
import store from "@/redux/store.js";

export const vizAnimation = (WIDTH, HEIGHT) => {
  const POS_X = 1800;
  const POS_Y = 500;
  const POS_Z = WIDTH <= 1440 ? 1200 : 600;
  const FOV = 50;
  const NEAR = 1;
  const FAR = 10000;
  const RESOLUTION = WIDTH < 1440 ? "1k" : "4k";
  const SM_RESOLUTION = WIDTH < 1440 ? "512" : "1k";

  // SCENE
  const Scene = new THREE.Scene();
  Scene.loaded = false;

  // CAMERA
  Scene.camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
  Scene.camera.position.z = 4;
  Scene.camera.name = "camera";

  Scene.camera.position.set(POS_X, POS_Y, POS_Z);
  Scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
  Scene.add(Scene.camera);

  // RENDERER
  Scene.renderer = new THREE.WebGLRenderer({ antialias: true });
  Scene.renderer.setClearColor(0x000000);
  Scene.renderer.setSize(WIDTH, HEIGHT);
  Scene.renderer.domElement.id = "vizCanvas";

  // Scene Loader Obj for Improved Loading UX
  Scene.sceneLoader = {
    skybox: null,
    spotlight: null,
    ambient: null,
    world: null,
    sky: null,
    data: null,
  };

  // mobile check and touch check
  Scene.touch = "ontouchstart" in document.documentElement ? true : false;

  // LOADER
  Scene.loader = new THREE.TextureLoader();
  Scene.loader.setPath("./assets/");
  console.log({ Scene });

  // OBJECTS
  Scene.cloudObj = new THREE.Object3D();
  Scene.cloudObj.name = "cloud";
  Scene.worldObj = new THREE.Object3D();
  Scene.worldObj.name = "world";
  Scene.dataArray = [null, null, null, null];

  // GEOMETRY
  Scene.spGeo = new THREE.SphereBufferGeometry(600, 50, 50);

  // CLOCK
  Scene.clock = new THREE.Clock();

  // CONTROLS
  window.controls = new OrbitControls(Scene.camera);
  window.controls.enableZoom = true;
  window.controls.enablePan = false;
  window.controls.minDistance = 1000;
  window.controls.maxDistance = 2800;

  Scene.lockOrbit = (boolean, axis) => {
    if (axis === "Y") {
      window.controls.minPolarAngle = boolean ? Math.PI / 2 : 0;
      window.controls.maxPolarAngle = boolean ? Math.PI / 2 : Math.PI;
    } else {
      window.controls.minAzimuthAngle = boolean ? Math.PI : -Infinity;
      window.controls.maxAzimuthAngle = boolean ? Math.PI : Infinity;
    }
  };

  Scene.autoRotation = true;
  Scene.setAutoRotation = (boolean) => {
    Scene.autoRotation = boolean;
  };

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
    Scene.mount.appendChild(Scene.renderer.domElement); // Called after DOM Loaded
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

  // preloader
  Scene.addPreloaderGlobe = () => {
    const geometry = new THREE.SphereBufferGeometry(610, 20, 20);
    const material = new THREE.MeshBasicMaterial({
      color: "#25963e",
      wireframe: true,
      transparent: true,
    });
    const preloaderGlobe = new THREE.Mesh(geometry, material);

    preloaderGlobe.name = "preloaderGlobe";
    Scene.add(preloaderGlobe);
  };

  Scene.removePreloaderGlobe = () => {
    Scene.remove(Scene.getObjectByName("preloaderGlobe"));
  };

  Scene.addData = () => {
    // Quake Lines rendered SSR and stored in mem
    const objLoader = new THREE.ObjectLoader();
    const STATE = store.getState();
    const { threeData } = STATE.viz;
    const { feedIndex } = STATE.option;

    if (threeData) {
      Scene.dataArray[0] =
        threeData[0] !== null ? objLoader.parse(threeData[0]) : null;
      Scene.dataArray[1] =
        threeData[1] !== null ? objLoader.parse(threeData[1]) : null;
      Scene.dataArray[2] =
        threeData[2] !== null ? objLoader.parse(threeData[2]) : null;
      Scene.dataArray[3] =
        threeData[3] !== null ? objLoader.parse(threeData[3]) : null;

      Scene.sceneLoader.data = Scene.dataArray[feedIndex];
      Scene.getObjectByName("world").add(Scene.dataArray[feedIndex]);
    }
  };

  // remove data when switching earthquake timescales
  Scene.changeTimeFrameData = (prevFeedIndex, newFeedIndex) => {
    store.dispatch(setAutoRotation(false));
    Scene.setAutoRotation(false);
    Scene.stop();
    const selectedQuake = Scene.getObjectByName("selectedQuake");
    const world = Scene.getObjectByName("world");
    if (world) {
      // Remove selected quake
      if (selectedQuake) {
        world.remove(selectedQuake);
      }
      world.remove(Scene.getObjectByName(`data${prevFeedIndex}`));
      world.add(Scene.dataArray[newFeedIndex]);
    }
    Scene.rotationReset(newFeedIndex);
    Scene.start();
  };

  // change globe type
  Scene.changeGlobe = (globe) => {
    store.dispatch(setAutoRotation(false));
    Scene.setAutoRotation(false);
    Scene.stop();
    // change texture code here
    const cloud = Scene.getObjectByName("cloud");
    const world = Scene.getObjectByName("world").children[1];
    let imgSrc;

    // Change Globe imgSrc
    switch (globe) {
      case "simulationGlobe":
      case "physicalGlobe":
        imgSrc = `earthmap${RESOLUTION}_optimized.jpg`;
        break;
      case "politicalGlobe":
        imgSrc = `politicalmap${RESOLUTION}_optimized.jpg`;
        break;
      case "tectonicGlobe":
        imgSrc = `tectonic${RESOLUTION}_optimized.jpg`;
        break;
    }

    Scene.loader.load(
      imgSrc,
      (texture) => {
        // Change Globe Lighting
        if (globe === "simulationGlobe" || globe === "physicalGlobe") {
          Scene.ambientLight.intensity = 0.1;
          Scene.spotlight.intensity = 0.9;
        } else if (globe === "politicalGlobe" || globe === "tectonicGlobe") {
          Scene.ambientLight.intensity = 1;
          Scene.spotlight.intensity = 0;
        }

        // Remove or Add Simulation Clouds
        globe === "simulationGlobe"
          ? Scene.add(Scene.cloudObj)
          : Scene.remove(cloud);

        world.material.map = texture;
        world.material.needsUpdate = true;
      },
      undefined, // onProgress calback unsupported
      (error) => {
        console.log("Loader Error");
        console.log(error);
        store.dispatch(setModalText("Globe Texture Failed to Download"));
      }
    );
    Scene.start();
  };

  // rotation reset
  Scene.rotationReset = (feedIndex) => {
    Scene.worldObj.rotation.y = 0;
    if (Scene.simulationGlobe === true) {
      // TODO: Check this logic
      Scene.cloudObj.rotation.y = 0;
    }
    Scene.getObjectByName(`data${feedIndex}`).rotation.y = 0;
  };

  // add a simple light
  Scene.addLights = () => {
    // console.log("Shining the Sun");
    Scene.ambientLight = new THREE.AmbientLight(0xffffff);
    Scene.spotlight = new THREE.DirectionalLight(0xffffff, 0.9);

    Scene.ambientLight.intensity = 0.1;
    Scene.ambientLight.updateMatrix();
    Scene.spotlight.position.set(
      Scene.camera.position.x,
      Scene.camera.position.y,
      Scene.camera.position.z
    );
    Scene.spotlight.lookAt(new THREE.Vector3(0, 0, 0));
    Scene.sceneLoader.spotlight = Scene.spotlight;
    Scene.sceneLoader.ambient = Scene.ambientLight;
    Scene.add(Scene.spotlight);
    Scene.add(Scene.ambientLight);
  };

  // add earths core
  Scene.addCore = () => {
    // console.log("Creating Molten Core");
    const url = `moltenCore${SM_RESOLUTION}_optimized.jpg`;

    Scene.loader.load(
      url,
      (img) => {
        const earthCore = new THREE.MeshBasicMaterial({
          map: img,
          side: THREE.BackSide,
        });
        const core = new THREE.Mesh(Scene.spGeo, earthCore);

        core.scale.set(0.985, 0.985, 0.985);
        Scene.worldObj.add(core);
      },
      undefined, // onProgress calback unsupported
      (error) => {
        console.log("Loader Error");
        console.log(error);
        store.dispatch(setModalText("Error Loading Molten Core Texture Map"));
      }
    );
  };

  // add the earth
  Scene.addEarth = () => {
    // console.log("Creating Earth");
    const bump = `earthbump${RESOLUTION}_optimized.jpg`;
    const specular = `earthspec${RESOLUTION}_optimized.jpg`;
    const texture = `earthmap${RESOLUTION}_optimized.jpg`;

    Scene.loader.load(
      texture,
      (planetTexture) => {
        Scene.loader.load(
          bump,
          (planetBump) => {
            Scene.loader.load(
              specular,
              (planetSpecular) => {
                const earthTexture = new THREE.MeshPhongMaterial({
                  map: planetTexture,
                  bumpMap: planetBump,
                  bumpScale: 0.5,
                  specularMap: planetSpecular,
                });
                const earth = new THREE.Mesh(Scene.spGeo, earthTexture);

                earth.name = "earth";
                Scene.worldObj.add(earth);
                Scene.sceneLoader.world = Scene.worldObj;
                Scene.add(Scene.worldObj);
              },
              undefined, // onProgress calback unsupported
              (error) => {
                console.log("Loader Error");
                console.log(error);
                store.dispatch(
                  setModalText("Error Loading Earth Specular Map")
                );
              }
            );
          },
          undefined, // onProgress calback unsupported
          (error) => {
            console.log("Loader Error");
            console.log(error);
            store.dispatch(setModalText("Error Loading Earth Bump Map"));
          }
        );
      },
      undefined, // onProgress calback unsupported
      (error) => {
        console.log("Loader Error");
        console.log(error);
        store.dispatch(setModalText("Error Loading Earth Texture Map"));
      }
    );
  };

  // add clouds
  Scene.addClouds = () => {
    // console.log("Adding Atmosphere");
    const texture = `earthClouds${RESOLUTION}_optimized.jpg`;

    Scene.loader.load(
      texture,
      (cloudsTexture) => {
        const materialClouds = new THREE.MeshPhongMaterial({
          alphaMap: cloudsTexture,
          transparent: true,
          depthWrite: false,
        });
        const meshClouds = new THREE.Mesh(Scene.spGeo, materialClouds);

        meshClouds.scale.set(1.015, 1.015, 1.015);
        Scene.cloudObj.add(meshClouds);
        Scene.sceneLoader.sky = Scene.cloudObj;
        Scene.add(Scene.cloudObj);
      },
      undefined, // onProgress calback unsupported
      (error) => {
        console.log("Loader Error");
        console.log(error);
        store.dispatch(setModalText("Error Loading Cloud Texture Map"));
      }
    );
  };

  // add space background
  Scene.addSkybox = () => {
    // console.log("Creating Universe");
    const imgArray = [
      "skybox_posx.png",
      "skybox_negx.png",
      "skybox_posy.png",
      "skybox_negy.png",
      "skybox_posz.png",
      "skybox_negz.png",
    ];
    const materialArray = [];

    for (let i = 0; i < 6; i++) {
      Scene.loader.load(
        imgArray[i],
        (skyTexture) => {
          const material = new THREE.MeshBasicMaterial({
            map: skyTexture,
            side: THREE.BackSide,
          });

          materialArray.push(material);
        },
        undefined, // onProgress calback unsupported
        (error) => {
          console.log("Loader Error");
          console.log(error);
          store.dispatch(setModalText("Error Loading Skybox Textures"));
        }
      );
    }

    const skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);
    const skyGeo = new THREE.BoxGeometry(5000, 5000, 5000, 1, 1, 1);
    const sky = new THREE.Mesh(skyGeo, skyboxMaterial);

    sky.name = "skybox";
    Scene.sceneLoader.skybox = sky;
    Scene.add(sky);
  };

  // TODO: Test using direct access vs getObjectByName helper

  // Zoom to Selected Quake
  Scene.cameraToQuake = (selectedQuake) => {
    if (selectedQuake) {
      // console.log("cameraToQuake");
      store.dispatch(setAutoRotation(false));
      Scene.setAutoRotation(false);
      const altitude = 1400;
      const coeff = 1 + altitude / 600;
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
    }
  };

  Scene.addSelectedQuake = (mag, vectorX, vectorY, vectorZ) => {
    // console.log("addSelectedQuake");
    const selectedRadius = mag * 5;
    const selectedGeo = new THREE.SphereGeometry(selectedRadius, 50, 50);
    const sphereColor = new THREE.Color(colorData(mag));
    const selectedTexture = new THREE.MeshBasicMaterial({
      color: sphereColor,
      transparent: true,
      opacity: 0.75,
    });
    const selectedMesh = new THREE.Mesh(selectedGeo, selectedTexture);

    if (Scene.getObjectByName("selectedQuake")) {
      Scene.getObjectByName("world").remove(
        Scene.getObjectByName("selectedQuake")
      ); // Remove old
    }

    selectedMesh.name = "selectedQuake";
    selectedMesh.position.set(vectorX, vectorY, vectorZ);
    Scene.getObjectByName("world").add(selectedMesh);
  };

  // TODO: Create addSelectedQuake and selectedQuake Scene key vals
  Scene.animate = ({ selectedQuake }) => {
    if (Scene.loaded) {
      Scene.spotlight.position.set(
        Scene.camera.position.x,
        Scene.camera.position.y,
        Scene.camera.position.z
      );

      if (Scene.autoRotation && !selectedQuake) {
        Scene.worldObj.rotation.y += 0.001;
        Scene.cloudObj.rotation.y += 0.0014;
      } else if (!Scene.autoRotation && selectedQuake) {
        Scene.cloudObj.rotation.y += 0.0004;
      } else if (Scene.autoRotation && selectedQuake) {
        Scene.worldObj.rotation.y += 0.001;
        Scene.cloudObj.rotation.y += 0.0014;
      } else if (Scene.loaded) {
        Scene.cloudObj.rotation.y += 0.0004;
      }
    }

    Scene.composer.render(Scene.clock.getDelta());
    TWEEN.update();
    Scene.frameId = window.requestAnimationFrame(Scene.animate);
  };

  //console.log(JSON.stringify(Scene))
  Scene.addPreloaderGlobe();
  Scene.startPreloader();
  // Scene.start();
  Scene.sceneLoaderInit = () => {
    // RECURSIVE LOADER
    const sceneLoaded = () => {
      for (const key in Scene.sceneLoader) {
        if (Scene.sceneLoader[key] === null) {
          console.log(`${key} not loaded!`);
          switch (key) {
            case "ambient":
            case "spotlight":
              Scene.addLights();
              break;
            case "sky":
              Scene.addClouds();
              break;
            case "skybox":
              Scene.addSkybox();
              break;
            case "world":
              Scene.addCore();
              Scene.addEarth();
              break;
            case "data":
              Scene.addData();
              break;
          }
          return false;
        } else if (key !== "data") {
          delete Scene.sceneLoader[key];
        }
      }
      return true;
    };

    // Loaded Check Loop
    if (sceneLoaded()) {
      for (const key in Scene.sceneLoader) {
        // Order important - add data to world obj after world obj loaded into scene
        key === "data" && Scene.sceneLoader[key] !== null
          ? Scene.getObjectByName("world").add(Scene.sceneLoader[key])
          : Scene.add(Scene.sceneLoader[key]);
      }
      Scene.removePreloaderGlobe();
      Scene.stopPreloader();
      store.dispatch(setVizTextureRendered(true));
      Scene.loaded = true;
    } else {
      setTimeout(() => Scene.sceneLoaderInit(), 1000);
    }
  };

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
