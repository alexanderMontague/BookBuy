import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import "firebase/storage";
import "core-js/stable";
import "regenerator-runtime/runtime";

const config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
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

  // add a posting
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
  getCurrentUserInfo() {
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .get();
  }

  // public
  // TODO: DEPRECATE
  async getAllPostings() {
    const allPostings = await this.db
      .collection("postings")
      .where("flagged", "==", false)
      .get();
    return allPostings.docs.map(doc => doc.data());
  }

  // method used to get paginated posting data
  async getPaginatedPostings(limit, lastDocument = null, searchParams) {
    let postings = [];
    let query = this.db
      .collection("postings")
      .orderBy("datePosted", "desc")
      .where("flagged", "==", false);

    // set up query to handle additional params
    if (!!searchParams.school) {
      query = query.where("userSchool.value", "==", searchParams.school);
    }
    if (!!searchParams.program) {
      query = query.where("program.value", "==", searchParams.program);
    }
    if (!!searchParams.level) {
      query = query.where("courseLevel", "==", searchParams.level);
    }
    // if we dont provide main text, limit query
    if (!searchParams.authorTitle) {
      query = query.limit(limit);
    }

    // if we provide a document to search from
    if (lastDocument) {
      postings = await query.startAfter(lastDocument).get();
      // if first query
    } else {
      postings = await query.get();
    }

    // filter title + author if applicable
    let postingsData = postings.docs.map(doc => doc.data());
    if (!!searchParams.authorTitle) {
      postingsData = postingsData.filter(
        post =>
          post.bookTitle
            .toLowerCase()
            .includes(searchParams.authorTitle.toLowerCase()) ||
          post.bookAuthor
            .toLowerCase()
            .includes(searchParams.authorTitle.toLowerCase())
      );
    }

    return [postingsData, postings.docs[postings.docs.length - 1]];
  }

  // query a collection
  async getDocsFromCollection(collection, queries) {
    this.db = this.db;
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

  // create a document
  async createDocument(collection, data) {
    this.db
      .collection(collection)
      .add(data)
      .then(async doc => {
        return (await doc.get()).data();
      })
      .catch(err => {
        console.error("error reporting user", err);
      });
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

  // create or add to a user chat
  createChat(messageData, isFirst, chatId = null) {
    if (!this.auth.currentUser) {
      return;
    }

    if (isFirst) {
      return this.db
        .collection("messages")
        .add(messageData)
        .then(async doc => {
          this.updateDocument("messages", doc.id, { id: doc.id });
          return (await doc.get()).data();
        })
        .catch(err => console.error("error adding first post", err));
    } else {
      this.db
        .collection("messages")
        .doc(chatId)
        .update({
          messages: app.firestore.FieldValue.arrayUnion(messageData)
        });
    }
  }
}

export default new Firebase();
