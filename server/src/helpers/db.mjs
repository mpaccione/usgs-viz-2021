import FlatDB from "flat-db";
import zlib from "zlib";

FlatDB.configure({ dir: "./storage" });

const dbCollections = { gzip: new Array(4), brotli: new Array(4) };
const collectionKeys = { gzip: new Array(4), brotli: new Array(4) };
export const bufferLengths = { gzip: new Array(4), brotli: new Array(4) };

const writeLogging = (timespan, key, index, compressionType) => {
  console.log(`${timespan}: ${key}`);
  console.log(dbCollections[compressionType][index]);
  console.log("Size: " + dbCollections[compressionType][index].count());
};


export const createCollection = (collectionName, index, schema) => {
  const gzipCollection = new FlatDB.Collection(`${collectionName}_gz`);
  const brotliCollection = new FlatDB.Collection(
    `${collectionName}_br`
  );
  dbCollections.gzip[index] = gzipCollection; // Store DB Ref in Memory
  dbCollections.brotli[index] = brotliCollection; // Store DB Ref in Memory

  console.log(`${collectionName} stored as flat file`);
  console.log({ gzipCollection, brotliCollection });
};

export const writeCollection = (index, timespan, data) => {
  zlib.gzip(JSON.stringify(data), (err, result) => {
    if (err) {
      console.log({ err });
    } else {
      const keyName = dbCollections.gzip[index].add({
        result
      });
      collectionKeys.gzip[index] = keyName;
      bufferLengths.gzip[index] = result.length
      writeLogging(timespan, keyName, index, "gzip");
    }
  });

  zlib.brotliCompress(JSON.stringify(data), (err, result) => {
    if (err) {
      console.log({ err });
    } else {
      const keyName = dbCollections.brotli[index].add({
        result
      });
      collectionKeys.brotli[index] = keyName;
      bufferLengths.brotli[index] = result.length
      writeLogging(timespan, keyName, index, "brotli");
    }
  });
};

export const updateCollection = (index, timespan, data) => {
  zlib.gzip(JSON.stringify(data), (err, result) => {
    if (err) {
      console.log({ err });
    } else {
      dbCollections.gzip[index].update(collectionKeys.gzip[index], {
        result
      });
      writeLogging(timespan, "update", index, "gzip");
    }
  });

  zlib.brotliCompress(JSON.stringify(data), (err, result) => {
    if (err) {
      console.log({ err });
    } else {
      dbCollections.brotli[index].update(collectionKeys.brotli[index], {
        result
      });
      writeLogging(timespan, "update", index, "brotli");
    }
  });
};

export const readCollection = (index, encoding) => {
  const encodedRead = encoding.includes("br")
    ? dbCollections.brotli[index].all()
    : dbCollections.gzip[index].all();
  return Buffer.from(encodedRead[0].result);
};
