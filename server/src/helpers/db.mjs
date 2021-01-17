import FlatDB from "flat-db";
import zlib from "zlib";

FlatDB.configure({ dir: "./storage" });

const dbCollections = { gzip: new Array(4), brotli: new Array(4) };
const collectionKeys = { gzip: new Array(4), brotli: new Array(4) };

const writeLogging = (timespan, key, index, compressionType) => {
  console.log(`${timespan}: ${key}`);
  console.log(dbCollections[compressionType][index]);
  console.log("Size: " + dbCollections[compressionType][index].count());
};

export const createCollection = (collectionName, index, schema) => {
  const gzipCollection = new FlatDB.Collection(`${collectionName}_gz`, schema);
  const brotliCollection = new FlatDB.Collection(`${collectionName}_br`, schema);
  dbCollections.gzip[index] = gzipCollection; // Store DB Ref in Memory
  dbCollections.brotli[index] = brotliCollection; // Store DB Ref in Memory

  console.log(`${collectionName} stored as flat file`);
  console.log({ gzipCollection, brotliCollection });
};

export const writeCollection = (index, timespan, data) => {
  zlib.gzip(data.toString(), (err, result) => {
    console.log({ buffer: result.toString('base64') });
    if (err) {
      console.log({ err });
    } else {
      const keyName = dbCollections.gzip[index].add({
        buffer: result.toString("base64"),
      });
      collectionKeys.gzip[index] = keyName;
      writeLogging(timespan, keyName, index, "gzip");
    }
  });

  zlib.brotliCompress(data.toString(), (err, result) => {
    if (err) {
      console.log({ err });
    } else {
      const keyName = dbCollections.brotli[index].add({
        buffer: result.toString("base64"),
      });
      collectionKeys.brotli[index] = keyName;
      writeLogging(timespan, keyName, index, "brotli");
    }
  });
};

export const updateCollection = (index, timespan, data) => {
  zlib.gzip(data.toString(), (err, result) => {
    if (err) {
      console.log({ err });
    } else {
      dbCollections.gzip[index].update(collectionKeys.gzip[index], {
        buffer: result.toString("base64"),
      });
      writeLogging(timespan, "update", index, "gzip");
    }
  });

  zlib.brotliCompress(data.toString(), (err, result) => {
    if (err) {
      console.log({ err });
    } else {
      dbCollections.brotli[index].update(collectionKeys.brotli[index], {
        buffer: result.toString("base64"),
      });
      writeLogging(timespan, "update", index, "brotli");
    }
  });
};

export const readCollection = (index) => {
  return dbCollections[index].all();
};
