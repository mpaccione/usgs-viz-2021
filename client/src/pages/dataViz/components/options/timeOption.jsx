import React from "react";

const TimeOption = ({
  name,
  mobileName,
  opacity,
  disabled,
  checked,
  onClick,
  mobile,
}) => (
  <>
    {mobile ? (
      <>
        <div className="timeSetting">
          <div className="triangle hour mobile"></div>
          <li
            className="mobile"
            style={{ opacity }}
            onClick={() => {
              onClick();
            }}
          >
            {mobileName}
          </li>
        </div>
      </>
    ) : (
      <>
        <div className="triangle hour desktop"></div>
        <div className="timeSetting">
          <li className="desktop" style={{ opacity }}>
            {name}
          </li>
          <li>
            <input
              type="checkbox"
              disabled={disabled}
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

export default TimeOption;
