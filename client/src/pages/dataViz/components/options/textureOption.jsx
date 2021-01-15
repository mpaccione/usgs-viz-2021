import React from "react";
import { Input } from "semantic-ui-react";

const TextureOption = ({ name, checked, onClick, mobile }) => (
  <>
    <div className="optionSetting">
      <div className="textWrap">
        {mobile ? (
          <li className="desktop">{name.substring(0,4)}</li>
        ) : (
          <li className="desktop">{name} Globe</li>
        )}
        <li>
          <Input
            type="checkbox"
            disabled=""
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

export default TextureOption;
