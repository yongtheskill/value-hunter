import { getAuth, onAuthStateChanged, signOut as fsignOut } from 'firebase/auth';

var user = null;
let auth = {};
const registerAuthListener = () => {
  auth = getAuth();
  const registerAuth = onAuthStateChanged(auth, (u) => {
    user = u;
    u.getIdTokenResult().then((t) => {
      console.log(t.claims);
    });
  });
};

const signOut = async () => {
  await fsignOut(auth);
};

export { user, registerAuthListener, signOut };
