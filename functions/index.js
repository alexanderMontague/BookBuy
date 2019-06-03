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

// send user an email when they recieve a first chat
exports.sendFirstMessageEmail = functions.firestore
  .document("messages/{userId}")
  .onCreate((snap, context) => {
    const newMessage = snap.data();

    db.collection("users")
      .where("id", "==", newMessage.recipient)
      .get()
      .then(messageDoc => {
        const receiver = messageDoc.docs[0].data();

        mailgun.messages().send(
          {
            from: "Book Buy <info@bookbuy.ca>",
            to: receiver.email,
            subject: "You have a new message on BookBuy!",
            template: "new_chat",
            "v:message": newMessage.messages[0].content
          },
          (error, body) => {
            console.log("ERR", error, "BOD", body);
          }
        );
      });

    return 0;
  });

// send user an email if they recieve a message with at least 2 hours since the last
exports.sendNewMessageEmail = functions.firestore
  .document("messages/{userId}")
  .onUpdate((change, context) => {
    const oldRecord = change.before.data();
    const newRecord = change.after.data();
    const messages = newMessage.messages;

    if (messages.length > 1) {
      const numMsgs = messages.length;
      const newMsg = messages[numMsgs - 1];
      const lastMsg = messages[numMsgs - 2];

      // if last message was more than 2 hours ago and its a new message not a read flag update
      if (
        newMsg.createdAt - lastMsg.createdAt >= 5200 &&
        newRecord.messages.length > oldRecord.messages.length
      ) {
        // user who should recieve email
        const recipientId =
          newMsg.sentBy === newRecord.recipient
            ? newRecord.sender
            : newRecord.recipient;

        db.collection("users")
          .where("id", "==", recipientId)
          .get()
          .then(messageDoc => {
            const receiver = messageDoc.docs[0].data();

            mailgun.messages().send(
              {
                from: "Book Buy <info@bookbuy.ca>",
                to: receiver.email,
                subject: "You have a new message on BookBuy!",
                template: "new_chat",
                "v:message": newMessage.messages[numMsgs - 1].content
              },
              (error, body) => {
                console.log("ERR", error, "BOD", body);
              }
            );
          });
      }
    }

    return 0;
  });
