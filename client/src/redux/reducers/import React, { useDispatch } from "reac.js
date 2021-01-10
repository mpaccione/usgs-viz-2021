import React, { useDispatch } from "react";
import { useSelector } from "react-redux";
import { isDataAvailable } from "@/helpers/options.jsx"

const Options = () => {
  const options = useSelector((state) => state.options);
  const vizThreeData = useSelector((state) => state.viz.threeData);
  const vizTextureRendered = useSelector(
    (state) => state.viz.vizTextureRendered
  );

  const dispatch = useDispatch();

  return (
    <div id="rightMenu">
      <h4 className="desktop">Settings</h4>
      <div className="triangle hour desktop"></div>
      <div className="timeSetting one">
        <div className="triangle hour mobile"></div>
        <li className="desktop" style={{ opacity: opacityCheck(vizThreeData[0]) }}>
          Past Hour
        </li>
        <li>
          <input
            id="oneHour"
            type="checkbox"
            disabled={vizThreeData[0] === null ? true : false}
            checked={options.feedIndex === 0 ? true : false}
            onChange={() => {
              dispatch(setFeedIndex(0));
            }}
          />
        </li>
        <li
          className="mobile"
          style={{ opacity: opacityCheck(vizThreeData[0]) }}
          onClick={() => {
            if (vizThreeData[0] !== null) {
              dispatch(setFeedIndex(0));
            }
          }}
        >
          1H
        </li>
      </div>
      <div className="triangle day desktop"></div>
      <div className="timeSetting two">
        <div className="triangle day mobile"></div>
        <li className="desktop" style={{ opacity: this.opacityCheck(1) }}>
          Past 24 Hours
        </li>
        <li>
          <input
            id="oneDay"
            type="checkbox"
            disabled={vizThreeData[1] === null ? true : false}
            checked={options.feedIndex === 1 ? true : false}
            onChange={() => {
              options.setFeedIndex(1);
            }}
          />
        </li>
        <li
          className="mobile"
          style={{ opacity: opacityCheck(vizThreeData[1]) }}
          onClick={() => {
            return options.vizThreeData[1] !== null
              ? options.setFeedIndex(1)
              : false;
          }}
        >
          24H
        </li>
      </div>
      <div className="triangle week desktop"></div>
      <div className="timeSetting three">
        <div className="triangle week mobile"></div>
        <li className="desktop" style={{ opacity: opacityCheck(vizThreeData[2]) }}>
          Past 7 Days
        </li>
        <li>
          <input
            id="oneWeek"
            type="checkbox"
            disabled={options.vizThreeData[2] === null ? true : false}
            checked={options.feedIndex === 2 ? true : false}
            onChange={() => {
              options.setFeedIndex(2);
            }}
          />
        </li>
        <li
          className="mobile"
          style={{ opacity: opacityCheck(vizThreeData[2]) }}
          onClick={() => {
            return vizThreeData[2] !== null
              ? options.setFeedIndex(2)
              : false;
          }}
        >
          7D
        </li>
      </div>
      <div className="triangle month desktop"></div>
      <div className="timeSetting four">
        <div className="triangle month mobile"></div>
        <li className="desktop" style={{ opacity: opacityCheck(vizThreeData[3]) }}>
          Past 30 Days
        </li>
        <li>
          <input
            id="oneMonth"
            type="checkbox"
            disabled={vizThreeData[3] === null ? true : false}
            checked={options.feedIndex === 3 ? true : false}
            onChange={() => {
              dispatch(setFeedIndex(3));
            }}
          />
        </li>
        <li
          className="mobile"
          style={{ opacity: opacityCheck(vizThreeData[3]) }}
          onClick={() => {
            return vizThreeData[3] !== null
              ? options.setFeedIndex(3)
              : false;
          }}
        >
          30D
        </li>
      </div>
      <br className="desktop" />
      <br className="desktop" />
      <div className="triangle hidden desktop"></div>
      <div className="topBorder desktop">
        <li>Auto X Rotation</li>
        <li>
          <input
            id="autoRotation"
            type="checkbox"
            checked={options.autoRotation}
            onChange={() => {
              dispatch(setAutoRotation(!options.autoRotation));
            }}
          />
        </li>
      </div>
      <div className="triangle hidden"></div>
      <div className="desktop">
        <li>Click &amp; Drag X Rotation</li>
        <li>
          <input
            id="mouseXRotation"
            type="checkbox"
            checked={!options.autoRotation}
            onChange={() => {
              dispatch(setClickXRotation(true));
            }}
            disabled={true}
          />
        </li>
      </div>
      <div className="triangle hidden"></div>
      <div className="desktop">
        <li>Click &amp; Drag Y Rotation</li>
        <li>
          <input
            id="mouseYRotation"
            type="checkbox"
            checked={!autoRotation}
            onChange={() => {
              dispatch(setClickYRotation(true));
            }}
            disabled={true}
          />
        </li>
      </div>
      <br className="desktop" />
      <br className="desktop" />

      {vizTextureRendered === true && (
        <>
          <div className="triangle hidden desktop"></div>
          <div className="topBorder one">
            <li className="desktop">Simulation Globe</li>
            <li>
              <input
                id="simulationMap"
                type="checkbox"
                disabled=""
                checked={options.simulationGlobe}
                onChange={() => {
                  dispatch(setSimulationGlobe(true));
                }}
              />
            </li>
            <li
              className="mobile"
              onClick={() => {
                dispatch(setSimulationGlobe(true));
              }}
            >
              Sim
            </li>
          </div>
          <div className="triangle hidden desktop"></div>
          <div className="two">
            <li className="desktop">Physical Globe</li>
            <li>
              <input
                id="physicalMap"
                type="checkbox"
                checked={options.physicalGlobe}
                onChange={() => {
                  dispatch(setPhysicalGlobe(true));
                }}
              />
            </li>
            <li
              className="mobile"
              onClick={() => {
                dispatch(setPhysicalGlobe(true));
              }}
            >
              Phys
            </li>
          </div>
          <div className="triangle hidden desktop"></div>
          <div className="three">
            <li className="desktop">Political Globe</li>
            <li>
              <input
                id="politicalMap"
                type="checkbox"
                checked={options.politicalGlobe}
                onChange={() => {
                  dispatch(setPoliticalGlobe(true));
                }}
              />
            </li>
            <li
              className="mobile"
              onClick={() => {
                dispatch(setPoliticalGlobe(true));
              }}
            >
              Poli
            </li>
          </div>
          <div className="triangle hidden desktop"></div>
          <div className="four">
            <li className="desktop">Tectonic Globe</li>
            <li>
              <input
                id="tectonicMap"
                type="checkbox"
                checked={options.tectonicGlobe}
                onChange={() => {
                  dispatch(setTectonicGlobe(true));
                }}
              />
            </li>
            <li
              className="mobile"
              onClick={() => {
                dispatch(setTectonicGlobe(true));
              }}
            >
              Tect
            </li>
          </div>
        </>
      )}

      {!vizTextureRendered && (
        <h3 id="mobileLoadingText">Loading, Please Wait! :)</h3>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);
