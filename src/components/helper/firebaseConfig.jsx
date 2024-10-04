import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {getAuth, deleteUser, signOut} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyAFXy0cprvSb5bPJzOxwzrNXZeF-NS3jEM",
  authDomain: "n-g-x-19301.firebaseapp.com",
  projectId: "n-g-x-19301",
  storageBucket: "n-g-x-19301.appspot.com",
  messagingSenderId: "710961543231",
  appId: "1:710961543231:web:6c2c49c5ec6b3c1ff2608a",
  measurementId: "G-72J4RWCVE6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const db = getFirestore(app);
const auth = getAuth(app)

export {app, storage, db, auth, deleteUser, signOut,collection,addDoc }