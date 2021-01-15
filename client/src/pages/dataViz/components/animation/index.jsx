import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { vizAnimation } from "@/helpers/dataVizAnimation";

const { innerWidth, innerHeight } = window;
const animationViz = vizAnimation(innerWidth, innerHeight);
let prevFeedIndex = null;

const Viz = React.memo(({ feedIndex }) => {
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

  useEffect(() => {
    if (prevFeedIndex !== null){
      console.log({prevFeedIndex, feedIndex})
      animationViz.changeTimeFrameData(prevFeedIndex, feedIndex)
    }
    prevFeedIndex = feedIndex;
  }, [feedIndex])

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
