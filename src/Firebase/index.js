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

  async isAuthenticated() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
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

  userObject() {
    return this.auth.currentUser;
  }

  // protected because adding a post
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

  // public as called on refresh
  getcurrentUserInfo() {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .get();
  }

  // public
  async getAllPostings() {
    const allPostings = await this.db.collection("postings").get();
    return allPostings.docs
      .map(doc => doc.data())
      .sort((postA, postB) => {
        if (postA.datePosted < postB.datePosted) return 1;
        else if (postA.datePosted > postB.datePosted) return -1;
        return 0;
      });
  }

  // query a collection
  async getDocsFromCollection(collection, queries) {
    let fullQueryLine = `this.db.collection('${collection}')`;

    for (let i = 0; i < queries.length; i++) {
      if (!!queries[i][2]) {
        fullQueryLine = fullQueryLine.concat(
          `.where('${queries[i][0]}', '${queries[i][1]}', '${queries[i][2]}')`
        );
      }
    }

    let filteredQueries = await eval(fullQueryLine).get();
    return filteredQueries.docs.map(doc => doc.data());
  }

  // update a document
  async updateDocument(collection, document, updatedValues) {
    const collectionRef = this.db.collection(collection).doc(document);
    const isSuccessful = await collectionRef.update(updatedValues);

    return isSuccessful;
  }

  // fetch a book picture based on its id
  async getBookPicture(key) {
    const bookURL = await this.storage
      .child(`postings/${key}`)
      .getDownloadURL();

    return bookURL;
  }

  // delete a document from a collection
  async deleteDocument(collection, document) {
    const deleteDoc = await this.db
      .collection(collection)
      .doc(document)
      .delete();
  }
}

export default new Firebase();
