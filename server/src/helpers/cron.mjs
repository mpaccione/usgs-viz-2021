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

const dbCollections = new Array(4);

// Create Initial Collections
urlPaths.forEach((path, index) => {
  dbCollections[index] = createCollection(urlPaths[index][0], [{}]);
});

export const cronDownload = () => {
  console.log("cronDownload");
  //   cron.schedule("*/4 * * * *", () => {
  urlPaths.forEach(async (path, index) => {
    console.log(index);
    try {
      const usgsReq = await axiosUSGS.get(path[1]);
      if (usgsReq && usgsReq.data && usgsReq.data.features) {
        const { quakes, threeData } = createThreeJSON(
          usgsReq.data.features,
          index
        );
        writeCollection(dbCollections[index], { quakes, threeData })
        //updateCollection(dbCollections[index], path[0], { quakes, threeData });
      }
    } catch (err) {
      console.log({ err });
    }
  });
  //   });
};
