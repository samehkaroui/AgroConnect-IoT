import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCA9eTk75aRrtSdBlZW28CVljAfhY3Km9I",
    authDomain: "iot-sys-532f6.firebaseapp.com",
    databaseURL: "https://iot-sys-532f6-default-rtdb.firebaseio.com",
    projectId: "iot-sys-532f6",
    storageBucket: "iot-sys-532f6.firebasestorage.app",
    messagingSenderId: "340248252791",
    appId: "1:340248252791:web:e9cbd9de63b99393b49172",
    measurementId: "G-M6368ZTBPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
