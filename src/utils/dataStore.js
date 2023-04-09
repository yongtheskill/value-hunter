import { getDoc, queryDocs, createCollectionRef, query, orderBy } from '../utils/firestore';

let newsData = [];
let counterList = [];
let counterObj = {};

const getCounters = async () => {
  if (counterList.length != 0) return;
  const snapshot = await queryDocs(query(createCollectionRef('counters'), orderBy('stockSymbol')));
  counterList = [];
  counterObj = {};
  snapshot.forEach((d) => {
    const id = d.id;
    const data = d.data();
    data['id'] = id;
    counterList.push(data);
    counterObj[id] = data;
  });
};

const getCounterList = async () => {
  await getCounters();
  return counterList;
};

const getCounterObj = async () => {
  await getCounters();
  return counterObj;
};

const getNewsData = async () => {
  if (newsData.length != 0) return newsData;
  newsData = (await getDoc('news', '0')).periods;
  return newsData;
};

const getData = () => {
  getCounters();
  getNewsData();
};

export { getCounterList, getCounterObj, getNewsData, getData };
