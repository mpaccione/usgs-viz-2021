import { batch } from "react-redux";
import { dispatchError, baseURL, get } from "@/api/index.js";
import {
  setPreloaderText,
  setProgressComplete,
  setVizLoad,
  setVizInitSuccess
} from "@/redux/reducers/menuSlice.js";
import { setThreeData, setQuakes } from "@/redux/reducers/vizSlice.js";
//import { setFeedIndex } from "@/redux/reducers/optionSlice.js";

export const dropdownOptions = [
  {
    key: 0,
    value: 0,
    text: "Past Hour",
  },
  {
    key: 1,
    value: 1,
    text: "Past 24 Hour",
  },
  {
    key: 2,
    value: 2,
    text: "Past 7 Days",
  },
  {
    key: 3,
    value: 3,
    text: "Past 30 Days",
  },
];

export const calcDownloadTimes = (bLen) => {
  // 2G - 0.1MB/S, 3G - 3MB/S, 4G - 20MB/S, 5G - 100MB/S
  return {
    "2G": Math.round((bLen / 100000) * 10000) / 10000 + "s",
    "3G": Math.round((bLen / 3000000) * 10000) / 10000 + "s",
    "4G": Math.round((bLen / 20000000) * 10000) / 10000 + "s",
    "5G": Math.round((bLen / 100000000) * 10000) / 10000 + "s",
  };
};

export const createIndexedDB = (indexedDB) => {
  const dbReq = indexedDB.open("JSON", 1);

  dbReq.onerror = (e) => dispatchError(e);

  dbReq.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore("geo", {
      autoIncrement: true,
    });
    db.createObjectStore("three", {
      autoIncrement: true,
    });
  };
};

export const getByteLengths = async (setByteLength, setDownloadTimes) => {
  try {
    const byteLengthRes = await get("/bufferLength");
    console.log({byteLengthRes})
    if (byteLengthRes && byteLengthRes.data) {
      let downloadTimeArr = []
      // DOWNLOAD TIMES
      byteLengthRes.data.forEach((datum) => {
        downloadTimeArr.push(calcDownloadTimes(datum));
      });
      // INDEXEDDB FOR CACHE (OFFLINE DATA)
      createIndexedDB(indexedDB);
      // SET COMPONENT STATE
      console.log({downloadTimeArr})
      setByteLength(byteLengthRes.data)
      setDownloadTimes(downloadTimeArr)
    }
  } catch (err) {
    dispatchError(err);
  }
};

export const getCacheData = (indexedDB, dispatch) => {
  const dbReq = indexedDB.open("JSON", 2);

  dbReq.onsuccess = (e) => {
    const db = e.target.result;
    // GEO
    const transaction1 = db.transaction("geo", "readonly");
    const store1 = transaction1.objectStore("geo");
    const storeReq1 = store1.getAll();
    // THREE
    const transaction2 = db.transaction("three", "readonly");
    const store2 = transaction2.objectStore("three");
    const storeReq2 = store2.getAll();

    storeReq1.onsuccess = (data) => {
      const { result } = data.target;
      // console.log("req1sucess");
      // console.log(result);

      result.length === 0
        ? dispatch(
            setPreloaderText("Cache Data Empty, Try Again with Internet")
          )
        : dispatch(setQuakes(result[0]));
    };

    storeReq2.onsuccess = (data) => {
      const { result } = data.target;
      // console.log("req2sucess");
      // console.log(result);

      if (result.length === 0) {
        dispatch(setPreloaderText("Cache Data Empty, Try Again with Internet"));
      } else {
        batch(() => {
          dispatch(setProgressComplete(100));
          dispatch(setThreeData(result[0]));
          dispatch(setVizInitSuccess(true));
        });
      }
    };
  };
};

export const putCacheData = (res, indexedDB, dispatch) => {
  const dbReq = indexedDB.open("JSON");

  dbReq.onsuccess = (e) => {
    console.log("req.onsuccess");

    const db = e.target.result;
    // GEO
    const transaction1 = db.transaction(["geo"], "readwrite");
    const store1 = transaction1.objectStore("geo");
    const storeReq1 = store1.put(res[0], 0);

    storeReq1.onsuccess = function (e) {
      console.log("storeReq1.onsuccess");
    };

    storeReq1.onerror = function (e) {
      console.log("storeReq1.onerror");
      dispatchError(e);
    };
    // THREE
    const transaction2 = db.transaction(["three"], "readwrite");
    const store2 = transaction2.objectStore("three");
    const storeReq2 = store2.put(res[1], 0);

    storeReq2.onsuccess = function (e) {
      console.log("storeReq2.onsuccess");
    };

    storeReq2.onerror = function (e) {
      console.log("storeReq2.onerror");
      dispatchError(e);
    };
    // SET REDUX
    batch(() => {
      dispatch(setQuakes(res[0]));
      dispatch(setThreeData(res[1]));
      // TODO: Create recursive function to get maximum feedIndex
      dispatch(setVizInitSuccess(true))
    });
  };
};

export const xhrReq = (byteLength, selectValue, indexedDB, dispatch) => {
  // XHR REQ (needed for progress api - displaying download progress)
  const xhrReq = new XMLHttpRequest();
  batch(() => {
    dispatch(setVizLoad(true));
    dispatch(setPreloaderText("Loading Big Data"));
  });

  xhrReq.open("GET", `${baseURL}/quakeData/${selectValue}`, true);

  xhrReq.onprogress = (e) => {
    console.log(e.loaded)
    console.log(byteLength[selectValue])
    dispatch(setProgressComplete((e.loaded / byteLength[selectValue]) * 100));
  };

  xhrReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const res = JSON.parse(this.responseText);
      console.log({res})
      dispatch(setProgressComplete(100))
      putCacheData(res, indexedDB, dispatch); // Updates Redux after storing to IndexedDB
    }
  };

  xhrReq.onerror = (e) => {
    dispatch(setPreloaderText("Connection Error, Loading Cache Data"));
    getCacheData();
  };

  xhrReq.send();
};
