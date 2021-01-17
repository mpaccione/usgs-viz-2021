import FlatDB from "flat-db";

FlatDB.configure({ dir: "./storage" });

export const createCollection = (collectionName, data) => {
  const collection = new FlatDB.Collection(collectionName)
  console.log(`${collectionName} stored as flat file`)
  console.log(collection)
  return collection
};

export const writeCollection = (collectionRef, data) => {
  const keys = collectionRef.add(data)
  console.log('\nkeys returned after adding multi items:');
  console.log(keys);
}

export const updateCollection = (collectionRef, key, data) => {
  const update = collectionRef.update(key, data)
  console.log(update)
}