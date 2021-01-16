import FlatDB from "flat-db";

FlatDB.configure({ dir: "./storage" });

export const createCollection = (collectionName, data) => {
  const Collection = new FlatDB.Collection(collectionName)
  const keys = Collection.add(data)
  console.log(`${collectionName} stored as flat file`)
  return Collection
};

export const updateCollection = (collectionRef, data) => {
  const update = collectionRef.update(data)
  console.log(update)
}