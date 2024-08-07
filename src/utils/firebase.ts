

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzkK9VFNz41nT_uaUXUu55VGn9jtKwwXQ",
  authDomain: "fliegenglas-app.firebaseapp.com",
  databaseURL: "https://fliegenglas-app.firebaseio.com",
  projectId: "fliegenglas-app",
  storageBucket: "fliegenglas-app.appspot.com",
  messagingSenderId: "648702534767",
  appId: "1:648702534767:web:baf7b83b16320b0244999a",
  measurementId: "G-KEH4SPPMH6",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

googleProvider.setCustomParameters({
  prompt: 'select_account'
});


export { auth, googleProvider as provider, facebookProvider, appleProvider };