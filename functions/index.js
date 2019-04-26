const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const config = functions.config();

const mailgun = require("mailgun-js")({
  apiKey: config.bookbuy.mailgun_api_key,
  domain: config.bookbuy.mailgun_domain
});

// send user welcome email on new user creation
exports.sendWelcomeEmail = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    const user = snap.data();

    mailgun.messages().send(
      {
        from: "Book Buy <info@bookbuy.ca>",
        to: user.email,
        subject: "Welcome to Book Buy!",
        template: "welcome",
        "v:fullName": user.fullName
      },
      (error, body) => {
        console.log("ERR", error, "BOD", body);
      }
    );

    return 0;
  });

// send user an email if they recieve a new first chat message
exports.sendNewMessageEmail = functions.firestore
  .document("messages/{userId}")
  .onCreate((snap, context) => {
    const messageData = snap.data();
    db.collection("users")
      .where("id", "==", messageData.recipient)
      .get()
      .then(messageDoc => {
        const messageData = messageDoc[0].data();

        mailgun.messages().send(
          {
            from: "Book Buy <info@bookbuy.ca>",
            to: reciever.email,
            subject: "You have a new message on BookBuy!",
            template: "new_chat",
            "v:message": messageData.messages[0].content
          },
          (error, body) => {
            console.log("ERR", error, "BOD", body);
          }
        );
      });

    return 0;
  });
