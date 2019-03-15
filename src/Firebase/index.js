import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDC_bRxWyf3dHFkreGgJavlgIR290xe5hw",
  authDomain: "bookbuy-783fd.firebaseapp.com",
  databaseURL: "https://bookbuy-783fd.firebaseio.com",
  projectId: "bookbuy-783fd",
  storageBucket: "bookbuy-783fd.appspot.com",
  messagingSenderId: "908982760807"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage().ref();
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async register(email, password, otherTraits) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .set({
        email,
        id: this.auth.currentUser.uid,
        ...otherTraits
      });

    return this.auth.currentUser;
  }

  addPosting(posting) {
    if (!this.auth.currentUser) {
      return;
    }

    return this.db
      .collection("postings")
      .add({
        ...posting
      })
      .then(docRef => docRef.id)
      .catch(error => {
        console.error("Error adding posting document: ", error);
      });
  }

  async isAuthenticated() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getcurrentUserInfo() {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .get();
  }

  async getCurrentUserQuote() {
    const quote = await this.db
      .doc(`users_codedamn_video/${this.auth.currentUser.uid}`)
      .get();
    return quote.get("quote");
  }
}

export default new Firebase();
