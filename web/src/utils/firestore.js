import { db } from '../main.js';
import {
  doc as fdoc,
  setDoc as fsetDoc,
  collection as fcollection,
  addDoc as faddDoc,
  updateDoc as fupdateDoc,
  getDoc as fgetDoc,
  getDocs as fgetDocs,
  deleteDoc as fdeleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

//when there is an id
const setDoc = async (collection, docID, data, options) => {
  const docRef = await fsetDoc(fdoc(db, collection, docID), data, options);
  return docRef;
};

//when no id
const addDoc = async (collection, data, options) => {
  const docRef = await faddDoc(fcollection(db, collection), data, options);
  return docRef;
};

const updateDoc = async (collection, docID, data, options) => {
  const docRef = await fupdateDoc(fdoc(db, collection, docID), data, options);
  return docRef;
};

const getDoc = async (collection, docID) => {
  const docSnap = await fgetDoc(fdoc(db, collection, docID));
  if (docSnap.exists()) return docSnap.data();
  return false;
};

const listDocs = async (collection) => {
  const querySnapshot = await fgetDocs(fcollection(db, collection));
  return querySnapshot;
};

const queryDocs = async (query) => {
  return await fgetDocs(query);
};

const deleteDoc = async (collection, docID) => {
  await fdeleteDoc(fdoc(db, collection, docID));
};

const createCollectionRef = (collection) => {
  return fcollection(db, collection);
};

export {
  db,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  listDocs,
  query,
  where,
  deleteDoc,
  orderBy,
  serverTimestamp,
  createCollectionRef,
  queryDocs,
};

/*
import { collection, query, where, getDocs } from "firebase/firestore";

const q = query(collection(db, "cities"), where("capital", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});


import { query, orderBy, limit } from "firebase/firestore";  

const q = query(citiesRef, orderBy("name")/orderBy("name", "desc"), limit(3)); 
//can have more than one orderBy etc
*/
