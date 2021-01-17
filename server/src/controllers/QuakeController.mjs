import { readCollection } from "../helpers/db.mjs"

// Quakes
///////////
export const getQuakeData = (req, res) => {
  const { quakeIndex } = req.body;
  // TODO: Finish   
  try {
    const data = readCollection(quakeIndex) 
    console.log(data)
    res.send(data)
  } catch (err) {
    res.status(500).send(err)
  }
};

export const testGetQuakeData = (req, res) => {
  console.log('testGetQuakeData')
  try {
    const data = readCollection(0) 
    console.log(data)
    res.send(data)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
};
