import axios from "axios";
import cron from "node-cron";
import { dbReq } from "./db.mjs";
import { createThreeJSON } from "./three.mjs";

const axiosUSGS = axios.create({
  baseURL: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const urlPaths = [
  "all_hour.geojson?minmagnitude=0.1",
  "all_day.geojson?minmagnitude=0.1",
  "all_week.geojson?minmagnitude=0.1",
  "all_month.geojson?minmagnitude=0.1",
];

export const cronDownload = () => {
  cron.schedule("*/4 * * * *", () => {
    urlPaths.forEach((path, index) => {
      try {
        const usgsReq = axiosUSGS.get(path);
        if (usgsReq && usgsReq.data) {
          const { quakes, threeData } = createThreeJSON(usgsReq.data, index);
          // Check for existing dataset - delete/rewrite if exists
          dbReq((db, client) => {
            db.collection("quakeData").findOneAndUpdate(
              { index: index },
              {
                $set: {
                  index,
                  quakes,
                  threeData,
                },
              },
              (err, result) => {
                err ? res.status(500).send(err) : console.log(result);
              }
            );
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    });
  });
};
