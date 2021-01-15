import React, { useEffect, useCallback } from "react";
import { vizAnimation } from "@/helpers/dataVizAnimation";

const { innerWidth, innerHeight } = window;
const animationViz = vizAnimation(innerWidth, innerHeight);
let prevFeedIndex = null;
let prevGlobeType = null;
let prevClickXRotation = null;
let prevClickYRotation = null;
let prevAutoRotation = null;

const Viz = React.memo(({ globes, feedIndex, clickXRotation, clickYRotation, autoRotation }) => {
  const animationMountRef = useCallback((node) => {
    if (node !== null) {
      animationViz.mount = node;
      animationViz.start();
      animationViz.sceneLoaderInit(); // RENDER
    }
  }, []);

  useEffect(() => {
    console.log({ animationViz });
    window.addEventListener("resize", resizeHandler);
    return () => {
      animationViz.stop();
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Changing Timeframe
  useEffect(() => {
    if (prevFeedIndex !== null) {
      console.log({ prevFeedIndex, feedIndex });
      animationViz.changeTimeFrameData(prevFeedIndex, feedIndex);
    }
    prevFeedIndex = feedIndex;
  }, [feedIndex]);

  // Changing Texture
  useEffect(() => {
    const newGlobeType = Object.keys(globes).filter((key) => {
      if (globes[key]) {
        return key.toString(); // Return KeyName if Truthy
      }
    })[0];
    if (prevGlobeType !== null && prevGlobeType !== newGlobeType) {
      animationViz.changeGlobe(newGlobeType);
    }
    prevGlobeType = newGlobeType;
  }, [globes]);

  // Changing Rotation
  useEffect(() => {
    console.log("useEffect lockOrbit")
    if (prevClickXRotation !== null && prevClickXRotation !== clickXRotation){
      animationViz.lockOrbit(!clickXRotation, "X")
    }
    if (prevClickYRotation !== null && prevClickYRotation !== clickYRotation){
      animationViz.lockOrbit(!clickYRotation, "Y")
    }
    if (prevAutoRotation !== null && prevAutoRotation !== autoRotation){
      animationViz.setAutoRotation(autoRotation)
    }
    
    prevClickXRotation = clickXRotation;
    prevClickYRotation = clickYRotation;
    prevAutoRotation = autoRotation;
  }, [clickXRotation, clickYRotation, autoRotation])

  const resizeHandler = () => {
    const { innerWidth, innerHeight } = window;
    animationViz.camera.aspect = innerWidth / innerHeight;
    animationViz.camera.updateProjectionMatrix();
    animationViz.renderer.setSize(innerWidth, innerHeight);
  };

  return (
    <div
      style={{ width: innerWidth, height: innerHeight }}
      ref={animationMountRef}
    />
  );
});

export default Viz;
