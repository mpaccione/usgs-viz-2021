import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux"
import { vizAnimation } from "@/helpers/dataVizAnimation";

const { innerWidth, innerHeight } = window;
const animationViz = vizAnimation(innerWidth, innerHeight);

const Viz = () => {
  // TODO: Implement Time DataSet Switching
  // const feedIndex = useSelector(state => state.option.feedIndex)
  // const prevFeedIndex = useSelector(state => state.option.prevFeedIndex)

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

  // useEffect(() => {
  //   if (prevFeedIndex){
  //     animationViz.changeTimeFrameData(prevFeedIndex, feedIndex)
  //   }
  // }, [feedIndex])

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
};

export default Viz;
