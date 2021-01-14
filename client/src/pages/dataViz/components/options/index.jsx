import React from "react";
import { useDispatch } from "react-redux";
import { isDataAvailable } from "@/helpers/dataVizOptions.js";
import RotationOption from "./rotationOption";
import TextureOption from "./textureOption";
import TimeOption from "./timeOption";
import {
  setAutoRotation,
  setClickXRotation,
  setClickYRotation,
  setGlobe,
} from "@/redux/reducers/optionSlice.js";

const Options = ({ mobile, options, threeData, vizTextureRendered }) => {
  const dispatch = useDispatch();

  return (
    <div id="rightMenu">
      <h4 className="desktop">Settings</h4>
      <div className={"menuSection"}>
        <TimeOption
          name={"Past Hour"}
          mobileName={"1H"}
          opacity={isDataAvailable[0]}
          disabled={threeData[0] === null ? true : false}
          checked={options.feedIndex === 0 ? true : false}
          onClick={() => {
            if (threeData[0] !== null) {
              dispatch(setFeedIndex(0));
            }
          }}
          mobile={mobile}
        />
        <TimeOption
          name={"Past 24 Hours"}
          mobileName={"24H"}
          opacity={isDataAvailable[1]}
          disabled={threeData[1] === null ? true : false}
          checked={options.feedIndex === 1 ? true : false}
          onClick={() => {
            if (threeData[1] !== null) {
              dispatch(setFeedIndex(1));
            }
          }}
          mobile={mobile}
        />
        <TimeOption
          name={"Past 7 Days"}
          mobileName={"7D"}
          opacity={isDataAvailable[3]}
          disabled={threeData[3] === null ? true : false}
          checked={options.feedIndex === 3 ? true : false}
          onClick={() => {
            if (threeData[3] !== null) {
              dispatch(setFeedIndex(3));
            }
          }}
          mobile={mobile}
        />
        <TimeOption
          name={"Past 30 Days"}
          mobileName={"30D"}
          opacity={isDataAvailable[4]}
          disabled={threeData[4] === null ? true : false}
          checked={options.feedIndex === 4 ? true : false}
          onClick={() => {
            if (threeData[4] !== null) {
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
            onClick={() => {
              dispatch(setAutoRotation(!options.autoRotation));
            }}
            disabled={false}
          />
          <RotationOption
            name={"Click &amp; Drag X Rotation"}
            checked={!options.autoRotation}
            onClick={() => {
              dispatch(setClickXRotation(true));
            }}
            disabled={true}
          />
          <RotationOption
            name={"Click &amp; Drag Y Rotation"}
            checked={!options.autoRotation}
            onClick={() => {
              dispatch(setClickYRotation(true));
            }}
            disabled={true}
          />
        </div>
      )}
      {vizTextureRendered === true && (
        <div className="menuSection">
          <TextureOption
            name={"Simulation"}
            checked={options.simulationGlobe}
            onClick={() => {
              dispatch(setGlobe("simulationGlove"));
            }}
            mobile={mobile}
          />
          <TextureOption
            name={"Physical"}
            checked={options.physicalGlobe}
            onClick={() => {
              dispatch(setGlobe("physicalGlobe"));
            }}
            mobile={mobile}
          />
          <TextureOption
            name={"Political"}
            checked={options.politicalGlobe}
            onClick={() => {
              dispatch(setGlobe("politicalGlobe"));
            }}
            mobile={mobile}
          />
          <TextureOption
            name={"Tectonic"}
            checked={options.tectonicGlobe}
            onClick={() => {
              dispatch(setGlobe("tectonicGlobe"));
            }}
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

export default Options;
