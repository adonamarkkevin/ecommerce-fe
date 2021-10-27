import firebase from "firebase/app";
import "firebase/auth";
// firebase config
const firebaseConfig = {
	apiKey: "AIzaSyAENCRrlKxgIGbkZz0DLXzs2QNwpQt700A",
	authDomain: "ecommerce-ac84b.firebaseapp.com",
	projectId: "ecommerce-ac84b",
	storageBucket: "ecommerce-ac84b.appspot.com",
	messagingSenderId: "784840076702",
	appId: "1:784840076702:web:8eb7b3e9599d3c63413a8f",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
