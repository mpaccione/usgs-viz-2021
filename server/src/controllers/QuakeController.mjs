import { dbReq } from "../helpers/db.mjs";

// Quakes
///////////
export const getQuakeData = (req, res) => {
  const { quakeIndex } = req.body;
  dbReq((db, client) => {
    db.collection("Quakes")
      .findOne(quakeJSON, {}, (error, result) => {
        if (error) {
          res.status(500).end();
        } else {
          client.close();
          res.status(200).send(result);
        }
      });
  });
};

