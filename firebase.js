/* =========================================================
   FIREBASE CONFIGURATION
   ARONEE TAXI BOOKING MANAGEMENT SYSTEM
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot
} from
    "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


/* =========================================================
   FIREBASE PROJECT
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyCin9CQwcuwCDNaMwDi2DDqi2ABUn21IkI",

    authDomain:
        "aronee-taxi-booking-system.firebaseapp.com",

    projectId:
        "aronee-taxi-booking-system",

    storageBucket:
        "aronee-taxi-booking-system.firebasestorage.app",

    messagingSenderId:
        "350411103175",

    appId:
        "1:350411103175:web:a4bb00691017ede7c417e2"

};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app =
    initializeApp(firebaseConfig);


/* =========================================================
   FIRESTORE DATABASE
========================================================= */

const db =
    getFirestore(app);


/* =========================================================
   TAXI BOOKINGS COLLECTION
========================================================= */

const taxiBookingsCollection =
    collection(db, "taxiBookings");


/* =========================================================
   MAKE AVAILABLE TO script.js
========================================================= */

window.firebaseTaxi = {

    db: db,

    collection: taxiBookingsCollection,

    doc: doc,

    setDoc: setDoc,

    getDocs: getDocs,

    updateDoc: updateDoc,

    deleteDoc: deleteDoc,

    onSnapshot: onSnapshot

};

console.log(
    "Firebase Taxi Booking System connected successfully."
);
