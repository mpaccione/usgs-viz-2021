import { readCollection } from "../helpers/db.mjs"

// Quakes
///////////
export const getQuakeData = (req, res) => {
  const { quakeIndex } = req.body;
  const encoding = req.headers['accept-encoding']
  // TODO: Finish   
  try {
    const data = readCollection(quakeIndex, encoding) 
    console.log(data)
    res.send(data)
  } catch (err) {
    res.status(500).send(err)
  }
};

export const testGetQuakeData = (req, res) => {
  const encoding = req.headers['accept-encoding']

  try {
    const data = readCollection(0, encoding) 
    console.log(data)
    res.send(data)
  } catch (err) {
    res.status(500).send(err)
  }
};
