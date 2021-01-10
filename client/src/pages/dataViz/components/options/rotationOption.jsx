import React from "react";

const RotationOption = ({ name, checked, onClick, disabled }) => (
  <>
    <div className="triangle hidden desktop"></div>
    <div className="topBorder desktop">
      <li>{name}</li>
      <li>
        <input
          id="autoRotation"
          type="checkbox"
          checked={checked}
          onChange={() => {
            onClick();
          }}
          disabled={disabled}
        />
      </li>
    </div>
  </>
);

export default RotationOption;
