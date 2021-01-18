import zlib from "zlib";
import * as Decoder from "string_decoder";
import { readCollection, bufferLengths } from "../helpers/db.mjs";

const decoder = new Decoder.StringDecoder("utf-8");

// PROD
///////////
export const getBufferLengths = (req, res) => {
  const encoding = req.headers["accept-encoding"];
  encoding.includes("br")
    ? res.send(bufferLengths.brotli)
    : res.send(bufferLengths.gzip);
};

export const getQuakeData = (req, res) => {
  const encoding = req.headers["accept-encoding"];

  try {
    const data = readCollection(0, encoding);
    encoding.includes("br")
      ? res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Encoding": "br",
          "Content-Length": data.length,
        })
      : res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip",
          "Content-Length": data.length,
        });

    res.end(data);
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
};

// TESTING
////////////
export const testGetQuakeData = (req, res) => {
  const encoding = req.headers["accept-encoding"];

  try {
    const data = readCollection(0, encoding);
    encoding.includes("br")
      ? zlib.brotliDecompress(data, (err, result) => {
          err ? res.status(500).send(err) : res.send(decoder.write(result));
        })
      : zlib.unzip(data, (err, result) => {
          err ? res.status(500).send(err) : res.send(decoder.write(result));
        });
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
};

export const testGetCompressedQuakeData = (req, res) => {
  const encoding = req.headers["accept-encoding"];

  try {
    const data = readCollection(0, encoding);
    encoding.includes("br")
      ? res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Encoding": "br",
          "Content-Length": data.length,
        })
      : res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip",
          "Content-Length": data.length,
        });

    res.end(data);
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
};
