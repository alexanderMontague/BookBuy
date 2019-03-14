import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";

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
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async register(email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser;
  }

  addQuote(quote) {
    if (!this.auth.currentUser) {
      return alert("Not authorized");
    }

    return this.db
      .doc(`users_codedamn_video/${this.auth.currentUser.uid}`)
      .set({
        quote
      });
  }

  async isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }

  async getCurrentUserQuote() {
    const quote = await this.db
      .doc(`users_codedamn_video/${this.auth.currentUser.uid}`)
      .get();
    return quote.get("quote");
  }
}

export default new Firebase();
