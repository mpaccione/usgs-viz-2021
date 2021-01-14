import React, { useEffect } from "react";
import { vizAnimation } from "@/helpers/dataVizAnimation";

const { innerWidth, innerHeight } = window;
const animationViz = vizAnimation(innerWidth, innerHeight);

const Viz = () => {
  useEffect(() => {
    console.log({animationViz})
    animationViz.sceneLoaderInit(); // RENDER
    window.addEventListener("resize", resizeHandler);
    return () => {
      animationViz.stop();
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const resizeHandler = () => {
    const { innerWidth, innerHeight } = window;
    animationViz.camera.aspect = innerWidth / innerHeight;
    animationViz.camera.updateProjectionMatrix();
    animationViz.renderer.setSize(innerWidth, innerHeight);
  };

  return (
    <div
      style={{ width: innerWidth, height: innerHeight }}
      ref={(mount) => {
        animationViz.mount = mount;
      }}
    />
  );
};

export default Viz;
