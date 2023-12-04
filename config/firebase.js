import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from '../constants';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.API_KEY,
  authDomain: Constants.AUTH_DOMAIN,
  projectId: Constants.PROJECT_ID,
  storageBucket: Constants.STORAGE_BUCKET,
  messagingSenderId: Constants.MESSAGING_SENDER_ID,
  appId: Constants.API_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore();

export { app, auth, database };