import axios from "axios";
import cron from "node-cron";
import { createCollection, writeCollection, updateCollection } from "./db.mjs";
import { createThreeJSON } from "./three.mjs";

const axiosUSGS = axios.create({
  baseURL: "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const urlPaths = [
  ["hour", "all_hour.geojson?minmagnitude=0.1"],
  ["day", "all_day.geojson?minmagnitude=0.1"],
  ["week", "all_week.geojson?minmagnitude=0.1"],
  ["month", "all_month.geojson?minmagnitude=0.1"],
];

const downloadAndStore = (update = false) => {
  urlPaths.forEach(async (path, index) => {
    console.log(index);
    try {
      const usgsReq = await axiosUSGS.get(path[1]);
      if (usgsReq && usgsReq.data && usgsReq.data.features) {
        const { quakes, threeData } = createThreeJSON(
          usgsReq.data.features,
          index
        );
        update
          ? updateCollection(index, path[0],{ quakes, threeData })
          : writeCollection(index, path[0], { quakes, threeData });
      }
    } catch (err) {
      console.log({ err });
    }
  });
};

export const cronDownload = () => {
  console.log("cronDownload");
  // Create Initial Collections
  urlPaths.forEach((path, index) => {
    createCollection(urlPaths[index][0], index, {
      // base64: ""
    });
  });
  // Initial Download
  downloadAndStore()

  cron.schedule("*/4 * * * *", () => {
    console.log("CRON")
    downloadAndStore("update")
  });
};
