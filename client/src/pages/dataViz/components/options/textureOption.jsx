import React from "react";
import { Input } from "semantic-ui-react";

const TextureOption = ({ name, checked, onClick, mobile }) => (
  <>
    <div className="optionSetting">
      <div className="textWrap">
        {mobile ? (
          <li className="mobile">{name.substring(0,4)}</li>
        ) : (
          <li className="desktop">{name} Globe</li>
        )}
        <li>
          <Input
            type="checkbox"
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
