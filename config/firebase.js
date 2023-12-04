import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from '../constants';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: Constants.manifest.extra.apiKey,
//   authDomain: Constants.manifest.extra.authDomain,
//   projectId: Constants.manifest.extra.projectId,
//   storageBucket: Constants.manifest.extra.storageBucket,
//   messagingSenderId: Constants.manifest.extra.messagingSenderId,
//   appId: Constants.manifest.extra.appId
// };
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
const auth = getAuth();
const database = getFirestore();