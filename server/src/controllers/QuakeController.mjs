import * as Decoder from "string_decoder"
import { readCollection } from "../helpers/db.mjs";

const decoder = new Decoder.StringDecoder('utf-8')

// Quakes
///////////
export const getQuakeData = (req, res) => {
  const { quakeIndex } = req.body;
  const encoding = req.headers["accept-encoding"];
  // TODO: Finish
  try {
    const data = readCollection(quakeIndex, encoding);
    console.log(data);
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const testGetQuakeData = (req, res) => {
  const encoding = req.headers["accept-encoding"];

  try {
    const data = readCollection(0, encoding);
    console.log(data)
    const json = decoder.write(Buffer.from(data));
    console.log(json)
    // res.set({
    //   'Content-Type': 'application/json',
    //   'Content-Encoding': encoding.includes('br') ? 'br' : "gzip",
    // })
    res.send(json)
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
};
