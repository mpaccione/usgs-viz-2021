import React from "react";
import { Input } from "semantic-ui-react";

// TODO: REFACTOR BETTER FOR MOBILE

const TimeOption = ({
  name,
  mobileName,
  opacity,
  disabled,
  checked,
  onClick,
  className,
  mobile,
}) => (
  <>
    <div className="optionSetting">
      <div
        className={`triangle ${mobile ? "mobile" : "desktop"} ${className}`}
      ></div>
      <div className="textWrap">
        <li
          className={`${mobile ? "mobile" : "desktop"}`}
          style={{ opacity }}
          onClick={() => {
            onClick();
          }}
        >
          {mobile ? mobileName : name}
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
);

export default TimeOption;
