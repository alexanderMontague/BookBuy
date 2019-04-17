import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { selectChat } from "../../actions/uiActions";
import firebase from "../../firebase";

const ChatPreview = props => {
  const { isFirst, selectChat, selectedChat, chatData, user } = props;
  let isMounted = false;
  const [chatName, setChatName] = useState(". . .");
  const [bookInfo, setBookInfo] = useState(". . .");

  const isSender = chatData.sender === user.id;

  useEffect(() => {
    isMounted = true;

    const fetchChatName = async () => {
      const chatName = await firebase.getDocsFromCollection("users", [
        ["id", "==", isSender ? chatData.recipient : chatData.sender]
      ]);

      const bookInfo = await firebase.getDocsFromCollection("postings", [
        ["postId", "==", chatData.post]
      ]);

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
      <div className={styles.chatUserName}>
        {isFirst ? `New Chat with ${chatData.fullName} . . .` : chatName}
      </div>
      <div>
        {`${isSender || isFirst ? "You are" : "They are"} interested in:`}
        &nbsp;&nbsp;
        <span className={styles.interestedIn}>{bookInfo.bookTitle}</span>
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
)(ChatPreview);
