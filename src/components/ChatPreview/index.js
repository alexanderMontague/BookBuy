import React from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { selectChat } from "../../actions/uiActions";

const ChatPreview = props => {
  const { isFirst, chatClicked, selectChat, selectedChat, chatData } = props;

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
        {isFirst ? `New Chat with ${chatData.fullName} ...` : chatData.id}
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
