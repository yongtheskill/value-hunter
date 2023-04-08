import { getDoc } from '../utils/firestore';

let newsData = [];

const getNewsData = async () => {
  if (newsData.length != 0) return newsData;
  newsData = (await getDoc('news', '0')).periods;
  return newsData;
};

export { getNewsData };
