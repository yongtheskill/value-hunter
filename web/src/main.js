import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { registerAuthListener } from './utils/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBK4dBY60KEk-2gGO-6Tg_35P-JC77k7Oc',
  authDomain: 'sh-trading-game.firebaseapp.com',
  projectId: 'sh-trading-game',
  storageBucket: 'sh-trading-game.appspot.com',
  messagingSenderId: '71037101220',
  appId: '1:71037101220:web:676d8e7c719823304a3231',
};

// Initialize Firebase
const fapp = initializeApp(firebaseConfig);
const auth = getAuth(fapp);
const db = getFirestore(fapp);
export { auth, db, fapp };

registerAuthListener();

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const vapp = createApp(App);

vapp.use(router);

vapp.mount('#app');
