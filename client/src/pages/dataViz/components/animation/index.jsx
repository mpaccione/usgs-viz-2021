import React from "react";
import { Scene } from "three";

const Viz = () => {
  <div
    style={{ width: innerWidth, height: innerHeight }}
    ref={(mount) => {
      Scene.mount = mount;
    }}
  />
};

export default Viz;
