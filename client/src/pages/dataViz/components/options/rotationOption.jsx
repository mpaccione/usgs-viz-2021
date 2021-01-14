import React from "react";
import { Input } from "semantic-ui-react"

const RotationOption = ({ name, checked, onClick, disabled }) => (
  <div className="optionSetting">
    <div className="textWrap">
      <li>{name}</li>
      <li>
        <Input
          type="checkbox"
          checked={checked}
          onChange={() => {
            onClick();
          }}
          disabled={disabled}
        />
      </li>
    </div>
  </div>
);

export default RotationOption;
