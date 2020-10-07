// database/firebaseDb.js

import * as firebase from 'firebase';
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCDOZoCA8LeoAtND7fo8oIzIkLRze9Q1U4",
    authDomain: "grouplife-dev.firebaseapp.com",
    databaseURL: "https://grouplife-dev.firebaseio.com",
    projectId: "grouplife-dev",
    storageBucket: "grouplife-dev.appspot.com",
    messagingSenderId: "933642425288",
    appId: "1:933642425288:web:c3f85473e82d9b462526fd",
    measurementId: "G-0LW4MT96M0"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore().settings({experimentalForceLongPolling: true});

export const firestore = firebase.firestore();
export const storage = firebase.storage();
export default firebase;