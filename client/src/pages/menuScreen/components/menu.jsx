import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Table, Button, Progress } from "semantic-ui-react";
import { getByteLengths, dropdownOptions, xhrReq } from "@/helpers/menu.js";
import "./menu.scss";

const indexedDB =
  window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

const Menu = () => {
  const vizLoad = useSelector((state) => state.menu.vizLoad);
  const progressComplete = useSelector((state) => state.menu.progressComplete);
  const preloaderText = useSelector((state) => state.menu.preloaderText);
  const [byteLength, setByteLength] = useState(null);
  const [downloadTimes, setDownloadTimes] = useState(null);
  const [selectValue, setSelectValue] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (byteLength === null) {
      getByteLengths(setByteLength, setDownloadTimes);
    }
  }, []);

  return (
    <div id="splashMenu">
      <h1>Earthquake Visualizer</h1>
      <br />
      {vizLoad === false ? (
        <>
          <div id="timeSelect">
            <Dropdown
              placeholder="Select Time Frame"
              options={dropdownOptions}
              onChange={(e, { value }) => {
                console.log(value);
                setSelectValue(value);
              }}
              
              value={selectValue}
            />
          </div>
          {selectValue !== null && (
            <>
              <h3>Estimated Download Time</h3>
              <Table id="speedTable">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Speed</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {downloadTimes &&
                    downloadTimes.map((time, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{index + 2}G</Table.Cell>
                        <Table.Cell>
                          {downloadTimes[selectValue][`${index + 2}G`]}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
              <Button
                onClick={() => {
                  xhrReq(byteLength, selectValue, indexedDB, dispatch); // Gets Viz Data, Stores in IndexedDB+Redux
                }}
              >
                Enter Visualizer
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Progress percent={progressComplete} indicating />
          <h3>{preloaderText}</h3>
        </>
      )}
      <h4>
        Data from The United States Geological Service
        <br />
        <span style={{opacity: 0.4}}>Chrome/Android Browser Required for Textures</span>
        <br />
        &copy; Michael Paccione
      </h4>
    </div>
  );
};

export default Menu;
