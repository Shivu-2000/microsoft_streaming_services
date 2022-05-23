// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPSCX9vr4XblsW5K9m4sp007-LCfL7Chw",
  authDomain: "mentee-d664b.firebaseapp.com",
  projectId: "mentee-d664b",
  storageBucket: "mentee-d664b.appspot.com",
  messagingSenderId: "726008737466",
  appId: "1:726008737466:web:7e20a88529c889bc459c83",
  measurementId: "G-RECBWMM558"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }