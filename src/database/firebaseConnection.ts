import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

let firebaseConfig = {
	apiKey: "AIzaSyBkEe4N3XG9nqcXzOnx9mFP8DZx_p9yTYQ",
	authDomain: "pomodoro-webapp.firebaseapp.com",
	projectId: "pomodoro-webapp",
	storageBucket: "pomodoro-webapp.appspot.com",
	messagingSenderId: "940628448117",
	appId: "1:940628448117:web:a2440b2f4341090123b93c",
	measurementId: "G-NC405DQJTS",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export default firebase;
