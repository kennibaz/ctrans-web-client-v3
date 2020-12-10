import firebase from 'firebase/app'
import 'firebase/firestore'
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyB9_A7IhB_JIQdc-PDN63MjisL7h1w3o0E",
  authDomain: "ctrans-eec0f.firebaseapp.com",
  databaseURL: "https://ctrans-eec0f.firebaseio.com",
  projectId: "ctrans-eec0f",
  storageBucket: "ctrans-eec0f.appspot.com",
  messagingSenderId: "107691378677",
  appId: "1:107691378677:web:1c398cc09bca7fc2d902bc",
  measurementId: "G-19Z7F2L81W"
};

try{
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack);
  }
}



  export default firebase