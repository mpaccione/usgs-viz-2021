import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuAnimation } from "@/helpers/menuAnimation";
import { setVizInit } from "@/redux/reducers/menuSlice";


let vizLoadPrev = false;
// SCENE
const { innerWidth, innerHeight } = window;
const animationBg = menuAnimation(innerWidth, innerHeight);

const Animation = () => {
  const vizLoad = useSelector((state) => state.menu.vizLoad);
  const dispatch = useDispatch();

  useEffect(() => {
    if (vizLoad && !vizLoadPrev) {
      vizLoadPrev = true;
      setTimeout(() => {
        dispatch(setVizInit(true));
      }, 1000);
    }
  }, [vizLoad]);

  useEffect(() => {
    animationBg.start(); // RENDER
    window.addEventListener("resize", resizeHandler);
    return () => {
      animationBg.stop();
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
