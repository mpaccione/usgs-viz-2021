import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Select, Table, Button } from "semantic-ui-react";
import { getByteLengths, dropdownOptions, xhrReq } from "@/utils/menu.js";
import "./menu.scss"

const indexedDB =
  window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

const Menu = () => {
  const vizLoad = useSelector((state) => state.menu.vizLoad);
  const progressComplete = useSelector((state) => state.menu.progressComplete);
  const preloaderText = useSelector((state) => state.menu.preloaderText);
  const [byteLength, setByteLength] = useState(false);
  const [downloadTimes, setDownloadTimes] = useState();
  const [selectValue, setSelectValue] = useState();

  useEffect(() => {
    if (!byteLength) {
      const { byteLengthData, downloadTimeArr } = getByteLengths();
      setByteLength(byteLengthData);
      setDownloadTimes(downloadTimeArr);
    }
  }, []);

  return (
    <div id="splashMenu">
      <h1>Earthquake Visualizer</h1>
      <br />
      {vizLoad === false ? (
        <>
          <Select
            placeholder="Select Time Frame"
            options={dropdownOptions}
            onChange={(e) => {
              setSelectValue(e.target.value);
            }}
          />
          {selectValue !== "null" && (
            <>
              <h3>Estimated Download Time</h3>
              <Table id="speedTable">
                <Table.Header>
                  <Table.HeaderCell>Speed</Table.HeaderCell>
                  <Table.HeaderCell>Time</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  {downloadTimes && downloadTimes.map((time, index) => (
                    <Table.Row>
                      <Table.Cell>{index + 2}G</Table.Cell>
                      <Table.Cell>
                        {downloadTimes[selectValue][index]}
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
        (Chrome/Android Browser Required for Texture Loading)
        <br />
        &copy; Michael Paccione
      </h4>
    </div>
  );
};

export default Menu;
