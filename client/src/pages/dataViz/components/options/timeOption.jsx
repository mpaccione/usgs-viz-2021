import React from "react";
import { Input } from "semantic-ui-react";

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
        <div className="optionSetting">
          <div className="triangle mobile"></div>
          <div className="textWrap">
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
        </div>
      </>
    ) : (
      <>
        <div className="optionSetting">
          <div className="triangle desktop"></div>
          <div className="textWrap">
            <li className="desktop" style={{ opacity }}>
              {name}
            </li>
            <li>
              <Input
                type="checkbox"
                disabled={disabled}
                checked={checked}
                onChange={() => {
                  onClick();
                }}
              />
            </li>
          </div>
        </div>
      </>
    )}
  </>
);

export default TimeOption;
