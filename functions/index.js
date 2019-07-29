const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const config = functions.config();

const moment = require("moment");
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();
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
        console.log("ERR:", error, "BOD:", body);
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
            console.log("ERR:", error, "BOD:", body);
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
    const messages = newRecord.messages;

    if (messages.length > 1) {
      const numMsgs = messages.length;
      const newMsg = messages[numMsgs - 1];
      const lastMsg = messages[numMsgs - 2];

      // if last message was more than 2 hours ago and its a new message not a read flag update
      if (
        newMsg.createdAt - lastMsg.createdAt >= 7200 &&
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
                "v:message": newRecord.messages[numMsgs - 1].content
              },
              (error, body) => {
                console.log("ERR:", error, "BOD:", body);
              }
            );
          });
      }
    }

    return 0;
  });

// use google cloud API to check uploaded books for nsfw content
exports.checkBookPostPicture = functions.storage
  .object()
  .onFinalize(async object => {
    const filePath = `gs://bookbuy-783fd.appspot.com/${object.name}`;
    const [result] = await visionClient.safeSearchDetection(filePath);
    // check if image rating could be nsfw
    const isNSFW = Object.values(result.safeSearchAnnotation).some(rating =>
      ["POSSIBLE", "LIKELY", "VERY_LIKELY"].includes(rating)
    );

    if (isNSFW) {
      let post = {};

      try {
        const postId = object.name.replace("postings/", "");
        // update post flagged property
        await db
          .collection("postings")
          .doc(postId)
          .update({
            flagged: true
          });

        // get nsfw post
        const postData = await db
          .collection("postings")
          .where("postId", "==", postId)
          .get();
        post = postData.docs[0].data();
      } catch (error) {
        console.log("ERROR FETCHING OR UPDATING NSFW POST:", error);
      }

      // send message to user stating why their post was flagged
      const chatRef = db.collection("messages");
      const currentBookbuyChats = await chatRef
        .where("sender", "==", "bT1L5gvZnKTW15zq4whF0qkJy6J2")
        .where("recipient", "==", post.userId)
        .get();

      const messageContent = {
        sender: "bT1L5gvZnKTW15zq4whF0qkJy6J2", // book_buy ID,
        recipient: post.userId,
        post: {
          id: "BOOK_BUY",
          fullName: "Book Buy",
          bookTitle: "",
          postId: "",
          messages: [],
          content: "",
          isFirst: false
        },
        messages: [
          {
            content: `
            Your book listing ${
              post.bookTitle
            } has been flagged for inappropriate content.\n
            This is most likely because your post image contains profanity, nudity, graphic violence or other sensitive content.\n
            If you believe this is a mistake, feel free to respond to this chat or send us an email at info@bookbuy.ca
          `,
            createdAt: moment().unix(),
            sentBy: "bT1L5gvZnKTW15zq4whF0qkJy6J2",
            isUnread: true
          }
        ]
      };

      // if first message from bookbuy
      if (currentBookbuyChats.docs.length === 0) {
        await chatRef
          .add(messageContent)
          .then(async msg => await chatRef.doc(msg.id).update({ id: msg.id }))
          .catch(err => {
            console.log("ERROR SENDING REMOVAL CHAT", err);
          });
      } else {
        await chatRef.doc(currentBookbuyChats.docs[0].data().id).update({
          messages: admin.firestore.FieldValue.arrayUnion({
            content: `
            Your book listing ${
              post.bookTitle
            } has been flagged for inappropriate content.\n
            This is most likely because your post image contains profanity, nudity, graphic violence or other sensitive content.\n
            If you believe this is a mistake, feel free to respond to this chat or send us an email at info@bookbuy.ca
          `,
            createdAt: moment().unix(),
            sentBy: "bT1L5gvZnKTW15zq4whF0qkJy6J2",
            isUnread: true
          })
        });
      }
    }
  });
