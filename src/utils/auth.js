import {
  onAuthStateChanged,
  signOut as fsignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../main';
import { v4 as uuidv4 } from 'uuid';

var user = null;
const registerAuthListener = () => {
  const registerAuth = onAuthStateChanged(auth, (u) => {
    user = u;
  });
};

const forceUser = () => {
  return auth.currentUser;
};

const signOut = async () => {
  await fsignOut(auth);
};

const registerPlayer = async () => {
  const email = uuidv4() + '@valuehunter.star-horizon.com';
  const password = uuidv4();
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  user = userCred.user;
  return user;
};

const checkAdmin = async () => {
  const user = auth.currentUser;
  return isAdmin(user);
};

const isAdmin = async (user) => {
  if (!user) return false;
  const idToken = await user.getIdTokenResult();
  return !!idToken.claims.admin;
};

export { user, registerAuthListener, signOut, forceUser, registerPlayer, checkAdmin, isAdmin };
