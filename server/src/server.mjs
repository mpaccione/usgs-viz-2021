import cors from "cors";
import morgan from "morgan";
import * as path from "path";
import { fileURLToPath } from 'url';
import expressStaticGzipMiddleware from "express-static-gzip";
import app from "./routes.mjs";
import { cronDownload } from "./helpers/cron.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

cronDownload();

app.use(morgan("combined"));
app.use(cors());
app.use(
  "/",
  expressStaticGzipMiddleware(path.join(__dirname, "../../client/build"), {
    enableBrotli: true,
    orderPreference: ["br", "gz"],
  })
);

app.get("/", (req, res) => res.send("Basic API"));

app.get("/.well-known(/*)?", function (req, res) {
  res.sendFile(path.join(__dirname, "../.well-known", "assetlinks.json"));
});

app.get("/privacy-policy", function (req, res) {
  res.sendFile(path.join(__dirname, "../privacy_policy.html"));
});

app.listen(8081, () => console.log("API listening on port 8081!"));
