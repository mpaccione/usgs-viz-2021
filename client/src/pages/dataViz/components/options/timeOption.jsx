import React from "react";
import { batch, useDispatch } from "react-redux";
import { Input, Icon } from "semantic-ui-react";
import { post, dispatchError } from "@/api/index.js";
import {
  setQuakesByIndex,
  setThreeDataByIndex,
} from "@/redux/reducers/vizSlice";

// TODO: REFACTOR BETTER FOR MOBILE

const TimeOption = ({
  name,
  mobileName,
  index,
  opacity,
  disabled,
  checked,
  onClick,
  className,
  mobile,
}) => {
  const dispatch = useDispatch();
  return (
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
            {disabled ? (
              <Icon
                name="arrow alternate circle down outline"
                onClick={async () => {
                  console.log("download");
                  // try {
                  const res = await post("/quakeData", { index });
                  console.log(res);
                  if (res && res.data) {
                    batch(() => {
                      dispatch(
                        setQuakesByIndex({ index, value: res.data.quakes })
                      );
                      dispatch(
                        setThreeDataByIndex({
                          index,
                          value: res.data.threeData,
                        })
                      );
                    });
                  }
                  // } catch (err) {
                  //   dispatchError(err);
                  // }
                }}
              />
            ) : (
              <Input
                type="checkbox"
                disabled={disabled}
                checked={checked}
                onChange={() => {
                  onClick();
                }}
              />
            )}
          </li>
        </div>
      </div>
    </>
  );
};

export default TimeOption;
