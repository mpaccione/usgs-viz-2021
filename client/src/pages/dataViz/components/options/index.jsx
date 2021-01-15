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
  setFeedIndex
} from "@/redux/reducers/optionSlice.js";
import { Loader } from "semantic-ui-react"
import "./index.scss"

const Options = ({ mobile, options, threeData, vizTextureRendered }) => {
  const dispatch = useDispatch();

  return (
    <div id="rightMenu">
      {!mobile && <h4>Settings</h4>}
      <div className={"menuSection"}>
        <hr></hr>
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
          className={"hour"}
          mobile={mobile}
        />
        <hr></hr>
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
          className={"day"}
          mobile={mobile}
        />
        <hr></hr>
        <TimeOption
          name={"Past 7 Days"}
          mobileName={"7D"}
          opacity={isDataAvailable[2]}
          disabled={threeData[2] === null ? true : false}
          checked={options.feedIndex === 2 ? true : false}
          onClick={() => {
            if (threeData[2] !== null) {
              dispatch(setFeedIndex(2));
            }
          }}
          className={"week"}
          mobile={mobile}
        />
        <hr></hr>
        <TimeOption
          name={"Past 30 Days"}
          mobileName={"30D"}
          opacity={isDataAvailable[3]}
          disabled={threeData[3] === null ? true : false}
          checked={options.feedIndex === 3 ? true : false}
          onClick={() => {
            if (threeData[3] !== null) {
              dispatch(setFeedIndex(3));
            }
          }}
          className={"month"}
          mobile={mobile}
        />
      </div>
      <hr></hr>
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
          <hr></hr>
          <RotationOption
            name={"Click & Drag X Rotation"}
            checked={!options.autoRotation}
            onClick={() => {
              dispatch(setClickXRotation(true));
            }}
            disabled={options.autoRotation}
          />
          <hr></hr>
          <RotationOption
            name={"Click & Drag Y Rotation"}
            checked={!options.autoRotation}
            onClick={() => {
              dispatch(setClickYRotation(true));
            }}
            disabled={options.autoRotation}
          />
        </div>
      )}
      <hr></hr>
      {vizTextureRendered === true && (
        <div className="menuSection">
          <TextureOption
            name={"Simulation"}
            checked={options.simulationGlobe}
            onClick={() => {
              dispatch(setGlobe("simulationGlobe"));
            }}
            mobile={mobile}
          />
          <hr></hr>
          <TextureOption
            name={"Physical"}
            checked={options.physicalGlobe}
            onClick={() => {
              dispatch(setGlobe("physicalGlobe"));
            }}
            mobile={mobile}
          />
          <hr></hr>
          <TextureOption
            name={"Political"}
            checked={options.politicalGlobe}
            onClick={() => {
              dispatch(setGlobe("politicalGlobe"));
            }}
            mobile={mobile}
          />
          <hr></hr>
          <TextureOption
            name={"Tectonic"}
            checked={options.tectonicGlobe}
            onClick={() => {
              dispatch(setGlobe("tectonicGlobe"));
            }}
            mobile={mobile}
          />
          <hr></hr>
        </div>
      )}
      {!vizTextureRendered && (
        <h3 id="mobileLoadingText"><Loader>Loading</Loader></h3>
      )}
    </div>
  );
};

export default Options;
