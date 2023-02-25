import { getAuth, onAuthStateChanged, signOut as fsignOut } from 'firebase/auth';
import { auth } from '../main';

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

export { user, registerAuthListener, signOut, forceUser };
