import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { selectChat } from "../../actions/uiActions";
import firebase from "../../firebase";

const ChatPreview = props => {
  const {
    isFirst,
    chatClicked,
    selectChat,
    selectedChat,
    chatData,
    user
  } = props;
  let isMounted = false;
  const [chatName, setChatName] = useState(". . .");

  useEffect(() => {
    isMounted = true;

    const fetchChatName = async () => {
      const chatName = await firebase.getDocsFromCollection("users", [
        [
          "id",
          "==",
          chatData.sender === user.id ? chatData.recipient : chatData.sender
        ]
      ]);

      if (isMounted) setChatName(chatName[0].fullName);
    };

    fetchChatName();

    return () => (isMounted = false);
  }, []);

  const clickHandler = () => {
    chatClicked();
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
        Interested in:&nbsp;&nbsp;
        <span className={styles.interestedIn}>
          Code Complete 3 this is a test
        </span>
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
