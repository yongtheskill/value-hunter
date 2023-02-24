import { db } from '../main.js';
import { doc, setDoc as fsetDoc, collection, addDoc as faddDoc } from 'firebase/firestore';

//when there is an id
const setDoc = async (collection, docID, data, options) => {
  const docRef = await fsetDoc(doc(db, collection, docID), data, options);
  return docRef;
};

//when no id
const addDoc = async (collection, data, options) => {
  const docRef = await faddDoc(collection(db, collection), data, options);
  return docRef;
};
