import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { selectChat } from "../../actions/uiActions";
import ChatPreview from "../ChatPreview";
import { withRouter } from "react-router";
import firebase from "../../firebase";
import moment from "moment";

const Chat = props => {
  const { selectChat, selectedChat, user } = props;
  const [newMessage, updateNewMessage] = useState(null);
  const [isFirstMessage, firstMessageHandler] = useState(false);
  const [currentMessage, updateCurrentMessage] = useState("");
  const [userSentChats, updateUserSentChats] = useState([]);
  const [userReceivedChats, updateUserReceivedChats] = useState([]);
  let isMounted = false;

  useEffect(() => {
    isMounted = true;

    // if we are sending a first message
    if (!!window.location.search) {
      const rawSellerInfo = new URLSearchParams(window.location.search).get(
        "send"
      );
      const sellerInfo = JSON.parse(atob(rawSellerInfo));
      selectChat(sellerInfo);
      if (isMounted) {
        updateNewMessage(sellerInfo);
        firstMessageHandler(true);
      }
    }

    firebase.db
      .collection("messages")
      .where("sender", "==", user.id)
      .onSnapshot(
        snapshot =>
          isMounted
            ? updateUserSentChats([
                ...userSentChats,
                ...snapshot.docs.map(doc => doc.data())
              ])
            : null,

        err => console.log("sender error", err)
      );

    firebase.db
      .collection("messages")
      .where("recipient", "==", user.id)
      .onSnapshot(
        snapshot =>
          isMounted
            ? updateUserReceivedChats([
                ...userReceivedChats,
                ...snapshot.docs.map(doc => doc.data())
              ])
            : null,
        err => console.log("receiver error", err)
      );

    console.log("in use effect");

    return () => (isMounted = false);
  }, []);

  const renderChatPreviews = () => {
    const chatPreviewData = [...userSentChats, ...userReceivedChats];
    console.log("re render messages", chatPreviewData);

    const chatPreviews = chatPreviewData.map(chat => {
      // re-render the chat's messages if we have new messages
      if (
        selectedChat &&
        chat.id === selectedChat.id &&
        JSON.stringify(chat) !== JSON.stringify(selectedChat)
      ) {
        selectChat(chat);
      }

      return (
        <ChatPreview
          chatData={chat}
          chatClicked={chatPreviewClickHandler}
          key={chat.id || "tempID"}
        />
      );
    });

    if (isFirstMessage) {
      chatPreviews.unshift(
        <ChatPreview
          isFirst
          chatData={newMessage}
          chatClicked={chatPreviewClickHandler}
          key="newMessageTempKey"
        />
      );
    }

    return chatPreviews;
  };

  const chatPreviewClickHandler = () => {
    console.log("hello");
  };

  const onChatSend = event => {
    event.preventDefault();

    if (isFirstMessage) {
      firebase.createChat(
        {
          sender: user.id,
          recipient: selectedChat.id,
          post: selectedChat.postId,
          messages: [
            {
              content: currentMessage,
              createdAt: moment().unix(),
              sentBy: user.id
            }
          ]
        },
        true
      );

      // get rid of temp create message once sent
      firstMessageHandler(false);
      props.history.push({
        search: ""
      });
    } else {
      firebase.createChat(
        {
          content: currentMessage,
          createdAt: moment().unix(),
          sentBy: user.id
        },
        false,
        selectedChat.id
      );
    }

    updateCurrentMessage("");
  };

  const renderMessages = () => {
    const { selectedChat } = props;
  };

  return (
    <div className={styles.mainChatContainer}>
      <div className={styles.header}>Current Messages</div>
      <div className={styles.contentContainer}>
        <div className={styles.chatOverview}>
          <div className={styles.chatsHeader}># Active Chats</div>
          <div className={styles.chatsContainer}>{renderChatPreviews()}</div>
        </div>
        <div className={styles.activeChat}>
          <div className={styles.chatHeader}>Possible Meeting Spot ....</div>
          <div className={styles.chatMessageArea}>
            {selectedChat &&
              selectedChat.messages.map(message => {
                return (
                  <div>
                    {message.content}
                    {"sent at: " +
                      moment.unix(message.createdAt).format("MMM DD, hh:mm")}
                  </div>
                );
              })}
          </div>
          <form className={styles.chatInput}>
            <input
              className={styles.chatInput}
              type="text"
              placeholder="Type your message here!"
              value={currentMessage}
              onChange={e => updateCurrentMessage(e.target.value)}
            />
            <button
              className={styles.chatSendButton}
              onClick={onChatSend}
              disabled={!currentMessage}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.authState.user,
  selectedChat: state.interfaceState.selectedChat
});

export default connect(
  mapStateToProps,
  { selectChat }
)(withRouter(Chat));
