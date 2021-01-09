import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { menuAnimation } from "@/helpers/menuAnimation";

let vizLoadPrev = false;
// SCENE
const { innerWidth, innerHeight } = window;
const animationBg = menuAnimation(innerWidth, innerHeight);

// TODO: Debug Missing Spheres
window.animationBg = animationBg;
console.log({ animationBg });

const Animation = () => {
  const vizLoad = useSelector((state) => state.menu.vizLoad);
  //const vizInit = useSelector((state) => state.menu.vizInit);

  useEffect(() => {
    if (vizLoad && !vizLoadPrev) {
      vizLoadPrev = true;
      setTimeout(() => {
        Scene.setVizInit(true);
      }, 1000);
    }
  }, [vizLoad]);

  useEffect(() => {
    animationBg.start(); // RENDER
    window.addEventListener("resize", resizeHandler);
    return () => {
      animationBg.stop();
      animationBg.mount.removeChild(animationBg.renderer.domElement);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const resizeHandler = () => {
    const { innerWidth, innerHeight } = window;
    animationBg.camera.aspect = innerWidth / innerHeight;
    animationBg.camera.updateProjectionMatrix();
    animationBg.renderer.setSize(innerWidth, innerHeight);
  };

  return (
    <div>
      <div
        style={{ innerWidth, innerHeight }}
        ref={(mount) => {
          animationBg.mount = mount;
        }}
      ></div>
    </div>
  );
};

export default Animation;
