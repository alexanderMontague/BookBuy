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
  const [chatHeader, setChatHeader] = useState("...");
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

    return () => (isMounted = false);
  }, []);

  // on chat change, fetch details about users

  const renderChatPreviews = () => {
    // sort chats by most recent chat
    let chatPreviewData = [...userSentChats, ...userReceivedChats];
    chatPreviewData = chatPreviewData.sort((chatOne, chatTwo) => {
      const chatOneMsg = [...chatOne.messages].pop();
      const chatTwoMsg = [...chatTwo.messages].pop();

      if (chatOneMsg.createdAt > chatTwoMsg.createdAt) return -1;
      else if (chatOneMsg.createdAt < chatTwoMsg.createdAt) return 1;

      return 0;
    });

    const chatPreviews = chatPreviewData.map(chat => {
      // only re-render the chat's messages if we have new messages
      if (
        selectedChat &&
        chat.id === selectedChat.id &&
        JSON.stringify(chat) !== JSON.stringify(selectedChat)
      ) {
        selectChat(chat);
      }

      return <ChatPreview chatData={chat} key={chat.id || "tempID"} />;
    });

    if (isFirstMessage) {
      chatPreviews.unshift(
        <ChatPreview isFirst chatData={newMessage} key="newMessageTempKey" />
      );
    }

    return chatPreviews;
  };

  const onChatSend = async event => {
    event.preventDefault();

    if (isFirstMessage) {
      const newChat = await firebase.createChat(
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

      // select the new chat
      selectChat(newChat);
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

    if (selectedChat) {
      const messageContainer = document.getElementById("chatMessageArea");
      if (messageContainer)
        // holy hack T_T
        setTimeout(
          () => (messageContainer.scrollTop = messageContainer.scrollHeight),
          100
        );

      return selectedChat.messages.map(message => {
        const wasSender = user.id === message.sentBy;
        return (
          <div
            className={[
              styles.singleChatContainer,
              wasSender ? styles.senderPos : styles.receiverPos
            ].join(" ")}
            key={message.createdAt + message.sentBy}
          >
            <div className={styles.dateContainer}>
              {moment.unix(message.createdAt).format("MMMM DD, hh:mm A")}
            </div>
            <div
              className={[
                styles.messageContainer,
                wasSender ? styles.sender : styles.receiver
              ].join(" ")}
            >
              {message.content}
            </div>
          </div>
        );
      });
    }
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
          {selectedChat ? (
            <div className={styles.chatHeader}>
              <div className={styles.chatName}>{`Chat with ${
                selectedChat.fullName ? selectedChat.fullName : chatHeader
              }`}</div>
              <input
                className={styles.meetingSpot}
                type="text"
                placeholder="Sugest a meeting place..."
              />
            </div>
          ) : (
            "No current chats"
          )}
          <div className={styles.chatMessageArea} id="chatMessageArea">
            {renderMessages()}
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
