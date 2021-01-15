import React, { useEffect, useCallback } from "react";
import { vizAnimation } from "@/helpers/dataVizAnimation";

const { innerWidth, innerHeight } = window;
const animationViz = vizAnimation(innerWidth, innerHeight);
// Timeframe
let prevFeedIndex = null;
// Texture
let prevGlobeType = null;
// Rotation
let prevClickXRotation = null;
let prevClickYRotation = null;
let prevAutoRotation = null;
// Selected Quake
let prevSelectedQuake = undefined; // undefined when not set

const resizeHandler = () => {
  const { innerWidth, innerHeight } = window;
  animationViz.camera.aspect = innerWidth / innerHeight;
  animationViz.camera.updateProjectionMatrix();
  animationViz.renderer.setSize(innerWidth, innerHeight);
};

const Viz = React.memo(
  ({
    globes,
    feedIndex,
    clickXRotation,
    clickYRotation,
    autoRotation,
    selectedQuake,
  }) => {
    // Mount
    const animationMountRef = useCallback((node) => {
      if (node !== null) {
        animationViz.mount = node;
        animationViz.start();
        animationViz.sceneLoaderInit(); // RENDER
      }
    }, []);

    // Responsive
    useEffect(() => {
      window.addEventListener("resize", resizeHandler);
      return () => {
        animationViz.stop();
        window.removeEventListener("resize", resizeHandler);
      };
    }, []);

    // Changing Timeframe
    useEffect(() => {
      if (prevFeedIndex !== null) {
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
      if (
        prevClickXRotation !== null &&
        prevClickXRotation !== clickXRotation
      ) {
        animationViz.lockOrbit(!clickXRotation, "X");
      }
      if (
        prevClickYRotation !== null &&
        prevClickYRotation !== clickYRotation
      ) {
        animationViz.lockOrbit(!clickYRotation, "Y");
      }
      if (prevAutoRotation !== null && prevAutoRotation !== autoRotation) {
        animationViz.setAutoRotation(autoRotation);
      }

      prevClickXRotation = clickXRotation;
      prevClickYRotation = clickYRotation;
      prevAutoRotation = autoRotation;
    }, [clickXRotation, clickYRotation, autoRotation]);

    // Changing Selected Quake
    useEffect(() => {
      if (selectedQuake !== undefined) {
        if (prevSelectedQuake !== selectedQuake) {
          console.log("cameraToQuake");
          animationViz.cameraToQuake(selectedQuake);
        }
        prevSelectedQuake = selectedQuake;
      }
    }, [selectedQuake]);

    return (
      <div
        style={{ width: innerWidth, height: innerHeight }}
        ref={animationMountRef}
      />
    );
  }
);

export default Viz;
