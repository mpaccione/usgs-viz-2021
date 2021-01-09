import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  VignetteEffect,
  BloomEffect,
  BlendFunction,
} from "postprocessing";

export const menuAnimation = (width, height) => {
    // SCENE
    const Scene = new THREE.Scene();

    // CAMERA
    Scene.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    Scene.camera.position.z = 4;

    // RENDERER
    Scene.renderer = new THREE.WebGLRenderer({antialias: true})
    Scene.renderer.setClearColor("#544435");
    Scene.renderer.setSize(width, height);
    // Scene.mount.appendChild(Scene.renderer.domElement); // Later after DOM is rendered

    // ADD SPHERES
    const geometry = new THREE.SphereGeometry(0.4, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: '#25963e', wireframe: true, transparent: true });
    Scene.sphereGroup = new THREE.Group();
    Scene.sphereOne = new THREE.Mesh(geometry, material);
    Scene.sphereTwo = new THREE.Mesh(geometry, material);
    Scene.sphereOne.name = "sphereOne";
    Scene.sphereTwo.name = "sphereTwo";
    Scene.sphereOne.position.setX(-2);
    Scene.sphereOne.position.setY(1);
    Scene.sphereTwo.position.setX(2);
    Scene.sphereTwo.position.setY(-1);
    Scene.sphereGroup.add(Scene.sphereOne);
    Scene.sphereGroup.add(Scene.sphereTwo);
    Scene.add(Scene.sphereGroup);

    // EFFECTS
    const vignette = new VignetteEffect({
        eskil: false,
        offset: 0.35,
        darkness: 0.5
    });
    const bloom = new BloomEffect({
        blendFunction: BlendFunction.SCREEN,
        resolutionScale: 1.0,
        distinction: 1.0,
        opacity: 4.0
    });
    const effectsPass = new EffectPass( Scene.camera, bloom, vignette );
    effectsPass.renderToScreen = true;

    Scene.composer = new EffectComposer( Scene.renderer );
    Scene.composer.setSize( width, height );
    Scene.composer.addPass( new RenderPass(Scene.scene, Scene.camera) );
    Scene.composer.addPass( effectsPass );

    Scene.clock = new THREE.Clock();

    Scene.animate = () => {
        Scene.sphereOne.rotation.x += 0.01;
        Scene.sphereOne.rotation.y += 0.01;
        Scene.sphereTwo.rotation.x += 0.01;
        Scene.sphereTwo.rotation.y += 0.01;
        Scene.sphereGroup.rotation.y += 0.01;
        TWEEN.update();
        Scene.composer.render(Scene.clock.getDelta())
        Scene.frameId = window.requestAnimationFrame(Scene.animate);
    }

    // Call in useEffect Hook after DOM loaded
    Scene.start = () => {
        if (!Scene.frameId){
            Scene.mount.appendChild(Scene.renderer.domElement);
            Scene.frameId = requestAnimationFrame(Scene.animate)
        }
    }

    Scene.stop = () => {
        cancelAnimationFrame(Scene.frameId)
    }

    Scene.outro = () => {
        const sphereArr = [Scene.sphereOne, Scene.sphereTwo];

        for (const sphere of sphereArr){
            const scaleObj = { x: 1, y: 1, z: 1 };
            const scaleTarget = { x: 3, y: 3, z: 3 };
            const scaleTween  = new TWEEN.Tween(scaleObj).to(scaleTarget, 1000).onUpdate(() => { 
                                    sphere.scale.x = scaleObj.x; 
                                    sphere.scale.y = scaleObj.y; 
                                    sphere.scale.z = scaleObj.z; 
                                }).start();
            const opacityTween = new TWEEN.Tween(sphere.material).to({ opacity: 0 }, 1000).start();
        }
    }

    return Scene
}