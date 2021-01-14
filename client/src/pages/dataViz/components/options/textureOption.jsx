import React from "react";
import { Input } from "semantic-ui-react"

const TextureOption = ({ name, checked, onClick, mobile }) => (
  <>
    {mobile ? (
      <>
        <div className="optionSetting">
          <div className="textWrap">
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
    ) : (
      <>
        <div className="optionSetting">
          <div className="textWrap">
            <li className="desktop">{name} Globe</li>
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
    )}
  </>
);

export default TextureOption;
