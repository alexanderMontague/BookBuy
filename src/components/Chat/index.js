import React from "react";
import styles from "./styles.scss";

const chat = () => {
  const renderChatPreviews = () => {
    return [
      "Alex Montague",
      "Nick Boulton",
      "Jay Ellul",
      "Jay Ellul2",
      "Jay Ellul3",
      "Jay Ellul4",
      "Jay Ellul5",
      "Jay Ellul6",
      "Jay Ellul7"
    ].map(user => {
      return (
        <div className={styles.chatPreview}>
          <div className={styles.chatUserName}>{user}</div>
          <div>
            Interested in:{"  "}
            <span className={styles.interestedIn}>
              Code Complete 3 this is a test
            </span>
          </div>
        </div>
      );
    });
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
            <input className={styles.chatInput} type="text" />
            <button className={styles.chatSendButton}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default chat;
