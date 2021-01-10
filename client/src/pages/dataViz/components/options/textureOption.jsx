import React from "react";

const TextureOption = ({ name, checked, onClick, mobile }) => (
  <>
    {mobile ? (
      <>
        <div className="triangle hidden"></div>
        <div className="topBorder one">
          <li>
            <input
              id="simulationMap"
              type="checkbox"
              disabled=""
              checked={checked}
              onChange={() => {
                onClick();
              }}
            />
          </li>
        </div>
      </>
    ) : (
      <>
        <div className="triangle hidden"></div>
        <div className="topBorder one">
          <li className="desktop">{name} Globe</li>
          <li>
            <input
              id="simulationMap"
              type="checkbox"
              disabled=""
              checked={checked}
              onChange={() => {
                onClick();
              }}
            />
          </li>
        </div>
      </>
    )}
  </>
);

export default TextureOption;
