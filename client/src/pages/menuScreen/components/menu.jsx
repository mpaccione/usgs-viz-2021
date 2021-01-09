import React, { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { dispatchError, get, baseURL } from "@/api/index.js";
import {
  calcDownloadTimes,
  createIndexedDB,
  putCacheData,
} from "@/utils/menu.js";

const indexedDB =
  window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

const Menu = () => {
  const vizLoad = useSelector((state) => state.menu.vizLoad);
  const preloaderText = useSelector((state) => state.menu.preloaderText);
  const [byteLength, setByteLength] = useState();
  const [downloadTimes, setDownloadTimes] = useState();
  const [selectValue, setSelectValue] = useState();

  const formattedDownloadTime = (index) => {
    return Math.round(downloadTimes[selectValue][index] * 10000) / 10000 + "s";
  };

  const getByteLengths = async () => {
    try {
      const byteLengthRes = await get("/bufferLength");
      if (byteLengthRes && byteLengthRes.data) {
        const { data } = byteLengthRes;
        const downloadTimeArr = [];
        // DOWNLOAD TIMES
        setByteLength(data);
        data.forEach((datum) => {
          downloadTimeArr.push(calcDownloadTimes(datum));
        });
        setDownloadTimes(downloadTimeArr);
        // INDEXEDDB FOR CACHE (OFFLINE DATA)
        createIndexedDB(indexedDB);
      }
    } catch (err) {
      dispatchError(err);
    }
  };

  useEffect(() => {
    getByteLengths();
  }, []);

  const xhrReq = () => {
    // XHR REQ (needed for progress api - displaying download progress)
    const xhrReq = new XMLHttpRequest();
    batch(() => {
      dispatch(setVizLoad(true));
      dispatch(setPreloaderText("Loading Big Data"));
    });

    // AJAX API
    xhrReq.open("GET", `${baseURL}/quakeData/${selectValue}`, true);
    xhrReq.onprogress = (e) => {
      dispatch(setProgressComplete((e.loaded / byteLength[selectValue]) * 100));
    };
    xhrReq.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const res = JSON.parse(this.responseText);
        putCacheData(res, indexedDB, dispatch); // Updates Redux after storing to IndexedDB
      }
    };
    xhrReq.onerror = (e) => {
      dispatch(setPreloaderText("Connection Error, Loading Cache Data"));
      getCacheData();
    };
    xhrReq.send();
  };

  return (
    <div id="splashScreen">
      <h1>Earthquake Visualizer</h1>
      <br />
      {vizLoad === false && (
        <>
          <select
            onChange={(e) => {
              setSelectValue(e.target.value);
            }}
          >
            <option disabled value="null" selected>
              Select Time Frame
            </option>
            <option value="0">Past Hour</option>
            <option value="1">Past 24 Hours</option>
            <option value="2">Past 7 Days</option>
            <option value="3">Past 30 Days</option>
          </select>
          {selectValue !== "null" && (
            <>
              <h3>Estimated Download Time</h3>
              <table id="speedTable">
                <tbody>
                  <tr>
                    <td>2G: </td>
                    <td>
                      {formattedDownloadTime(0)}
                    </td>
                  </tr>
                  <tr>
                    <td>3G: </td>
                    <td>
                      {formattedDownloadTime(1)}
                    </td>
                  </tr>
                  <tr>
                    <td>4G: </td>
                    <td>
                      {formattedDownloadTime(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>5G: </td>
                    <td>
                      {formattedDownloadTime(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                onClick={() => {
                  xhrReq();
                }}
              >
                Enter Visualizer
              </button>
            </>
          )}
        </>
      )}
      {/* TODO: Get Semantic UI Version
      {this.props.vizLoad === true && (
        <LinearProgress
          variant="determinate"
          value={this.props.progressComplete}
        />
      )} */}
      {vizLoad === true && <h3>{preloaderText}</h3>}
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
