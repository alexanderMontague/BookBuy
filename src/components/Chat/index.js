import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { selectChat } from "../../actions/uiActions";
import firebase from "../../firebase";
import moment from "moment";

const _chatPreview = props => {
  const { isFirst, chatClicked, selectChat, selectedChat, chatData } = props;

  const clickHandler = () => {
    chatClicked();
    selectChat(chatData);
  };

  return (
    <div
      className={[
        styles.chatPreview,
        selectedChat && selectedChat.fullName === chatData.fullName
          ? styles.selectedChat
          : null
      ].join(" ")}
      onClick={clickHandler}
    >
      <div className={styles.chatUserName}>
        {isFirst ? `New Chat with ${chatData.fullName} ...` : chatData.fullName}
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

const Chat = props => {
  useEffect(() => {
    if (!!window.location.search) {
      const rawSellerInfo = new URLSearchParams(window.location.search).get(
        "send"
      );
      const sellerInfo = JSON.parse(atob(rawSellerInfo));
      props.selectChat(sellerInfo);
      firstMessageHandler(true);
    }
  }, []);

  const { selectedChat } = props;
  const [isFirstMessage, firstMessageHandler] = useState(false);
  const [currentMessage, updateCurrentMessage] = useState("");

  const renderChatPreviews = () => {
    const chatPreviews = [
      { fullName: "Alex Montague" },
      { fullName: "Nick Boulton" },
      { fullName: "Jay Ellul" },
      { fullName: "Jay Ellul2" },
      { fullName: "Jay Ellul3" },
      { fullName: "Jay Ellul4" }
    ].map(user => {
      return (
        <ChatPreview
          chatData={user}
          chatClicked={chatPreviewClickHandler}
          key={user.fullName}
        />
      );
    });

    if (isFirstMessage) {
      chatPreviews.unshift(
        <ChatPreview
          isFirst
          chatData={selectedChat}
          chatClicked={chatPreviewClickHandler}
          key={selectedChat.fullName}
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
          sender: props.user.id,
          recipient: selectedChat.id,
          post: selectedChat.postId,
          messages: [
            {
              content: currentMessage,
              createdAt: moment().unix(),
              sentBy: props.user.id
            }
          ]
        },
        true
      );
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
          <div className={styles.chatHeader}>Possible Meeting Spot ....</div>
          <div className={styles.chatMessageArea}>Active chat area</div>
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
              disabled={!selectedChat}
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

const ChatPreview = connect(
  mapStateToProps,
  { selectChat }
)(_chatPreview);

export default connect(
  mapStateToProps,
  { selectChat }
)(Chat);
