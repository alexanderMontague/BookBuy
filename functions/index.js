const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

var mailgun = require("mailgun-js")({
  apiKey: "950a7ad2cc727d81542c37ee91d239db-dc5f81da-5984f649",
  domain: "bookbuy.ca"
});

exports.sendWelcomeEmail = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    const user = snap.data();
    console.log("USER", user);

    mailgun.messages().send(
      {
        from: "Book Buy <info@bookbuy.ca>",
        to: user.email,
        subject: "Welcome to Book Buy!",
        userFullName: user.fullName,
        text: "This is a test"
      },
      (error, body) => {
        console.log("ERR", error, "BOD", body);
      }
    );

    return 0;
  });
