import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export const ObjectId = mongodb.ObjectId;

export const dbReq = (dbCb) => {
  mongodb.MongoClient.connect(process.env.DB_URL, function (err, client) {
    if (err) {
      throw err;
      client.close();
      res.status(500).end();
    } else {
      const db = client.db(process.env.DB_NAME);
      dbCb(db, client);
    }
  });
};

export const getCollection = (db, client, collectionName, res) => {
  db.collection(collectionName)
    .find()
    .toArray((error, result) => {
      if (error) {
        res.status(500).end();
      } else {
        client.close();
        res.status(200).send(result);
      }
    });
};

export const dbConnTest = () => {
  dbReq((db, client) => {
    console.log("MongoDB connection successful");
    const listDatabases = async () => {
      const dbList = await db.admin().listDatabases();
      console.log("Databases:");
      dbList.databases.forEach((db) => console.log(` - ${db.name}`));
    };
    console.log(listDatabases());
    client.close();
  });
};
