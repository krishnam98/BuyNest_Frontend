import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWNDb8Bthcjlw5ld0Sz6hPoh4tr0OYQI4",
  authDomain: "clone-6b1d5.firebaseapp.com",
  projectId: "clone-6b1d5",
  storageBucket: "clone-6b1d5.appspot.com",
  messagingSenderId: "987432450581",
  appId: "1:987432450581:web:b514ad979640963874ec1c",
  measurementId: "G-PZE6BJC13V",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
