import {
  onAuthStateChanged,
  signOut as fsignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../main';
import { v4 as uuidv4 } from 'uuid';
import { useClassStore } from './classStore';

var user = null;
const registerAuthListener = () => {
  const unsubscribe = onAuthStateChanged(auth, async (u) => {
    if (u == null) {
      console.log(window.location.pathname);
      if (window.location.pathname != '/') {
        const c = useClassStore();
        await c.clear();
        window.location.href = '/';
      }
    }
    user = u;
  });
};

const waitForAuth = (fn) => {
  const unsubscribe = onAuthStateChanged(auth, (u) => {
    if (u) {
      fn(u);
    }
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

export {
  user,
  registerAuthListener,
  signOut,
  forceUser,
  registerPlayer,
  checkAdmin,
  isAdmin,
  waitForAuth,
};
