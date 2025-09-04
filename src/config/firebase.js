import { initializeApp } from "firebase/app";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDFbv-r2xq0iuFVX_2XJOyrDUCUNDUQ87A",
//   authDomain: "science-5fa51.firebaseapp.com",
//   projectId: "science-5fa51",
//   storageBucket: "science-5fa51.firebasestorage.app",
//   messagingSenderId: "745779075168",
//   appId: "1:745779075168:web:bcef10a16cb53a05410b05",
//   measurementId: "G-T4C40Y5SPE",
// };


const firebaseConfig = {
  apiKey: "AIzaSyArIOKzUDtecE4HA63znopbE0T_d1LTxpM",
  authDomain: "physics-lab-a0eea.firebaseapp.com",
  projectId: "physics-lab-a0eea",
  // storageBucket: "physics-lab-a0eea.firebasestorage.app",
  storageBucket: "physics-lab-a0eea.appspot.com" ,
  messagingSenderId: "947565452974",
  appId: "1:947565452974:web:116fe7cfa6b12fc317d73f",
  measurementId: "G-BHPEEESFJN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
