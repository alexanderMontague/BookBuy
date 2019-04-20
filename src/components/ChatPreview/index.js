import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { selectChat } from "../../actions/uiActions";
import firebase from "../../firebase";

const ChatPreview = props => {
  const { isFirst, selectChat, selectedChat, chatData, user } = props;
  const [chatName, setChatName] = useState(". . .");
  const [bookInfo, setBookInfo] = useState(". . .");
  let isMounted = false;
  let isUnread = false;
  const isSender = chatData.sender === user.id;

  // if unread messages, toggle flag
  chatData.messages.forEach(msg => {
    if (msg.sentBy !== user.id && msg.isUnread === true) {
      isUnread = true;
    }
  });

  useEffect(() => {
    isMounted = true;

    const fetchChatName = async () => {
      const chatName = await firebase.getDocsFromCollection("users", [
        ["id", "==", isSender ? chatData.recipient : chatData.sender]
      ]);

      // get chat data if regular chat, or use passed data for new chat
      let bookInfo = [];
      if (!chatData.bookTitle) {
        bookInfo = await firebase.getDocsFromCollection("postings", [
          ["postId", "==", chatData.post]
        ]);
      } else {
        bookInfo = [
          {
            ...chatData
          }
        ];
      }

      if (isMounted) {
        setChatName(chatName[0].fullName);
        setBookInfo(bookInfo[0]);
      }
    };

    fetchChatName();

    return () => (isMounted = false);
  }, []);

  const clickHandler = () => {
    selectChat(chatData);

    // set the new messages as read
    let currDocument = chatData;
    currDocument.messages = currDocument.messages.map(msg => {
      return { ...msg, isUnread: false };
    });

    if (isUnread) {
      firebase.updateDocument("messages", chatData.id, currDocument);
    }
  };

  return (
    <div
      className={[
        styles.chatPreview,
        selectedChat && selectedChat.id === chatData.id
          ? styles.selectedChat
          : null
      ].join(" ")}
      onClick={clickHandler}
    >
      <div className={styles.previewContent}>
        <div className={styles.chatUserName}>
          {isFirst ? `New Chat with ${chatData.fullName} . . .` : chatName}
        </div>
        <div>
          {`${isSender || isFirst ? "You are" : "They are"} interested in:`}
          &nbsp;&nbsp;
          <span className={styles.interestedIn}>{bookInfo.bookTitle}</span>
        </div>
      </div>
      {isUnread && <div className={styles.unread} />}
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
)(ChatPreview);
