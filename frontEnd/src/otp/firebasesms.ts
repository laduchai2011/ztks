// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDOr00-ll8MFWd42Zqxzv-Z-Jwia1rZStQ',
    authDomain: 'ztksoptsms.firebaseapp.com',
    projectId: 'ztksoptsms',
    storageBucket: 'ztksoptsms.firebasestorage.app',
    messagingSenderId: '524852897614',
    appId: '1:524852897614:web:9eda0270574aa2b569e01f',
    measurementId: 'G-1WYW5L9HBT',
};

// const firebaseConfig = {
//     apiKey: 'AIzaSyCjbUjJVfRA7kh5Bscvf2KmKWuu91AfcJs',
//     authDomain: 'kaquariumgroup.firebaseapp.com',
//     projectId: 'kaquariumgroup',
//     storageBucket: 'kaquariumgroup.firebasestorage.app',
//     messagingSenderId: '559063636084',
//     appId: '1:559063636084:web:743a6b8a78a67dad179921',
//     measurementId: 'G-P1B964S849',
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth_firebase = getAuth(app);
// const analytics = getAnalytics(app);
