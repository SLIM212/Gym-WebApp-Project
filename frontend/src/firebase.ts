import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbdZOIGzhqtOg1FWrB6a1VgbOld9j1ocY",
  authDomain: "gym-web-app-project.firebaseapp.com",
  projectId: "gym-web-app-project",
  storageBucket: "gym-web-app-project.firebasestorage.app",
  messagingSenderId: "321095322587",
  appId: "1:321095322587:web:10bf239a582a3e14afb5fe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);