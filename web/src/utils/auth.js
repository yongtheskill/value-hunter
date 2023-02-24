import { getAuth, onAuthStateChanged } from 'firebase/auth';

var user = null;

const registerAuthListener = () => {
  const auth = getAuth();
  const registerAuth = onAuthStateChanged(auth, (u) => {
    console.log(u);
    user = u;
  });
};

export { user, registerAuthListener };
