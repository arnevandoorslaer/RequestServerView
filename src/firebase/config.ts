import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyDB6qqS74epkqLD6unepTq1mCygYG1aPA4',
  authDomain: 'songrequest-246613.firebaseapp.com',
  databaseURL: 'https://songrequest-246613.firebaseio.com',
  projectId: 'songrequest-246613',
  storageBucket: 'songrequest-246613.appspot.com',
  messagingSenderId: '727709270985',
  appId: '1:727709270985:web:a47c75d211da10da9c9e18',
  measurementId: 'G-100748LHW0',
});

const songFirestore = firebase.firestore();

const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { songFirestore, timestamp };
