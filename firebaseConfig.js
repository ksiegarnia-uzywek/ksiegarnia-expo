import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDP6bKIvtX4VQf-CNC5JpifFv38MH8lMv0",
  authDomain: "ksiegarniauzywek.firebaseapp.com",
  projectId: "ksiegarniauzywek",
  storageBucket: "ksiegarniauzywek.appspot.com",
  messagingSenderId: "62404638793",
  appId: "1:662404638793:web:aa423e85dfc385f944b798",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
