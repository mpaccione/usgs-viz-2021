import express from "express";
import { getQuakeData, getBufferLengths, testGetQuakeData, testGetCompressedQuakeData } from "./controllers/QuakeController.mjs"

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

app.use(express.json());
// app.use(express.urlencoded());

// QUAKE DATA
app.get("/api/bufferLength", getBufferLengths);
app.post("/api/quakeData", getQuakeData);
// TESTING
app.get("/api/quakeData", testGetQuakeData);
app.get("/api/compressedQuakeData", testGetCompressedQuakeData);


export default app;
