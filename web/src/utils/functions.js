import { getFunctions, httpsCallable } from 'firebase/functions';
import { fapp } from '../main';
const functions = getFunctions(fapp, 'asia-southeast1');

const getFn = (name) => {
  return httpsCallable(functions, name);
};

export { getFn };
