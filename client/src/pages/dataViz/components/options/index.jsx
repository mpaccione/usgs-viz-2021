import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isDataAvailable } from "@/helpers/options.jsx";
import RotationOption from "./rotationOption";
import TextureOption from "./textureOption";
import TimeOption from "./timeOption";

const Options = () => {
  const options = useSelector((state) => state.options);
  const vizThreeData = useSelector((state) => state.viz.threeData);
  const vizTextureRendered = useSelector(
    (state) => state.viz.vizTextureRendered
  );
  const [mobile, setMobile] = useState(window.innerWidth < 1440 ? true : false);
  const dispatch = useDispatch();

  const resizeHandler = () => {
    window.innerWidth < 1440 ? setMobile(true) : setMobile(false); // TODO: Throttle
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div id="rightMenu">
      <h4 className="desktop">Settings</h4>
      <div className={"menuSection"}>
        <TimeOption
          name={"Past Hour"}
          mobileName={"1H"}
          opacity={isDataAvailable[0]}
          disabled={vizThreeData[0] === null ? true : false}
          checked={options.feedIndex === 0 ? true : false}
          onClick={() => {
            if (vizThreeData[0] !== null) {
              dispatch(setFeedIndex(0));
            }
          }}
          mobile={mobile}
        />
        <TimeOption
          name={"Past 24 Hours"}
          mobileName={"24H"}
          opacity={isDataAvailable[1]}
          disabled={vizThreeData[1] === null ? true : false}
          checked={options.feedIndex === 1 ? true : false}
          onClick={() => {
            if (vizThreeData[1] !== null) {
              dispatch(setFeedIndex(1));
            }
          }}
          mobile={mobile}
        />
        <TimeOption
          name={"Past 7 Days"}
          mobileName={"7D"}
          opacity={isDataAvailable[3]}
          disabled={vizThreeData[3] === null ? true : false}
          checked={options.feedIndex === 3 ? true : false}
          onClick={() => {
            if (vizThreeData[3] !== null) {
              dispatch(setFeedIndex(3));
            }
          }}
          mobile={mobile}
        />
        <TimeOption
          name={"Past 30 Days"}
          mobileName={"30D"}
          opacity={isDataAvailable[4]}
          disabled={vizThreeData[4] === null ? true : false}
          checked={options.feedIndex === 4 ? true : false}
          onClick={() => {
            if (vizThreeData[4] !== null) {
              dispatch(setFeedIndex(4));
            }
          }}
          mobile={mobile}
        />
      </div>
      {!mobile && (
        <div className="menuSection">
          <RotationOption
            name={"Auto X Rotation"}
            checked={options.autoRotation}
            onClick={dispatch(setAutoRoation(!options.autoRotation))}
            disabled={false}
          />
          <RotationOption
            name={"Click &amp; Drag X Rotation"}
            checked={!options.autoRotation}
            onClick={dispatch(setClickXRotation(true))}
            disabled={true}
          />
          <RotationOption
            name={"Click &amp; Drag Y Rotation"}
            checked={!options.autoRotation}
            onClick={dispatch(setClickYRotation(true))}
            disabled={true}
          />
        </div>
      )}
      {vizTextureRendered === true && (
        <div className="menuSection">
          <TextureOption
            name={"Simulation"}
            checked={options.simulationGlobe}
            onClick={dispatch(setSimulationGlobe(true))}
            mobile={mobile}
          />
          <TextureOption
            name={"Physical"}
            checked={options.physicalGlobe}
            onClick={dispatch(setPhysicalGlobe(true))}
            mobile={mobile}
          />
          <TextureOption
            name={"Political"}
            checked={options.politicalGlobe}
            onClick={dispatch(setPoliticalGlobe(true))}
            mobile={mobile}
          />
          <TextureOption
            name={"Tectonic"}
            checked={options.tectonicGlobe}
            onClick={dispatch(setTectonicGlobe(true))}
            mobile={mobile}
          />
        </div>
      )}
      {!vizTextureRendered && (
        <h3 id="mobileLoadingText">Loading, Please Wait! :)</h3>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);
