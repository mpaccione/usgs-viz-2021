import { batch } from "react-redux";
import { dispatchError, get, post } from "@/api/index.js";
import {
  setPreloaderText,
  setProgressComplete,
  setVizLoad,
  setVizInitSuccess,
} from "@/redux/reducers/menuSlice.js";
import {
  setThreeDataByIndex,
  setQuakesByIndex,
} from "@/redux/reducers/vizSlice.js";

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
  return new Promise((resolve, reject) => {
    const dbReq = indexedDB.open("JSON", 1);

    dbReq.onerror = (e) => {
      dispatchError(e);
      reject(e);
    }
  
    dbReq.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("geo", {
        autoIncrement: true,
      });
      db.createObjectStore("three", {
        autoIncrement: true,
      });
      console.dir({ stores: db })
      resolve(db);
    };

    dbReq.onsuccess = (e) => {
      const db = e.target.result;
      resolve(db)
    };
  });
};

export const getByteLengths = async (setByteLength, setDownloadTimes) => {
  try {
    const byteLengthRes = await get("/bufferLength");

    if (byteLengthRes && byteLengthRes.data) {
      let downloadTimeArr = [];
      // DOWNLOAD TIMES
      byteLengthRes.data.forEach((datum) => {
        downloadTimeArr.push(calcDownloadTimes(datum));
      });
      // INDEXEDDB FOR CACHE (OFFLINE DATA)
      await createIndexedDB(indexedDB);
      // SET COMPONENT STATE
      console.log({ downloadTimeArr });
      setByteLength(byteLengthRes.data);
      setDownloadTimes(downloadTimeArr);
    }
  } catch (err) {
    dispatchError(err);
  }
};

export const getCacheData = (indexedDB, dispatch, index) => {
  const dbReq = indexedDB.open("JSON");

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
      console.log({ index: index, value: result[index] })

      result.length === 0
        ? dispatch(
            setPreloaderText("Cache Data Empty, Try Again with Internet")
          )
        : dispatch(setQuakesByIndex({ index: index, value: result[index] }));
    };

    storeReq2.onsuccess = (data) => {
      const { result } = data.target;
      // console.log("req2sucess");
      console.log(result);
      console.log({ index: index, value: result[index] })

      if (result.length === 0) {
        dispatch(setPreloaderText("Cache Data Empty, Try Again with Internet"));
      } else {
        batch(() => {
          dispatch(setProgressComplete(100));
          dispatch(setThreeDataByIndex({ index: index, value: result[index] }));
          dispatch(setVizInitSuccess(true));
        });
      }
    };
  };
};

export const putCacheData = (
  res,
  index,
  indexedDB,
  dispatch,
  updateRedux = true
) => {
  const dbReq = indexedDB.open("JSON");

  dbReq.onsuccess = async (e) => {
    console.log("req.onsuccess");

    const db = e.target.result;

    if (!db.objectStoreNames.contains("geo") || !db.objectStoreNames.contains("three")) {
      await createIndexedDB(indexedDB);
    }

    // GEO
    const transaction1 = db.transaction(["geo"], "readwrite");
    const store1 = transaction1.objectStore("geo");
    const storeReq1 = store1.put(res.quakes, index);

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
    const storeReq2 = store2.put(res.threeData, index);

    storeReq2.onsuccess = function (e) {
      console.log("storeReq2.onsuccess");
    };

    storeReq2.onerror = function (e) {
      console.log("storeReq2.onerror");
      dispatchError(e);
    };
    // SET REDUX
    if (updateRedux) {
      batch(() => {
        dispatch(setQuakesByIndex({ index: index, value: res.quakes }));
        dispatch(setThreeDataByIndex({ index: index, value: res.threeData }));
        dispatch(setVizInitSuccess(true));
      });
    }
  };
};

export const quakeDataReq = async (byteLength, selectValue, indexedDB, dispatch) => {
  batch(() => {
    dispatch(setVizLoad(true));
    dispatch(setPreloaderText("Loading Big Data"));
  });

  try {
    const res = await post("quakeData", {index: selectValue}, {
      onUploadProgress: progressEvent =>  dispatch(setProgressComplete((progressEvent.loaded / byteLength[selectValue]) * 100))
    });
    if (res && res.data){
      dispatch(setProgressComplete(100));
      putCacheData(res.data, selectValue, indexedDB, dispatch); // Updates Redux after storing to IndexedDB
    }
  } catch (err) {
    dispatch(setPreloaderText("Connection Error, Loading Cache Data"));
    getCacheData(indexedDB, dispatch, selectValue);
  }
};
