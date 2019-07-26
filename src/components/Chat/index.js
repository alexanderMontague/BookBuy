import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { FaTrashAlt, FaFlag } from "react-icons/fa";
import { selectChat } from "../../actions/uiActions";
import { seenChats } from "../../actions/userActions";
import ChatPreview from "../ChatPreview";
import { withRouter } from "react-router";
import firebase from "../../firebase";
import moment from "moment";
import sanitizeHTML from "sanitize-html";
import Modal from "react-modal";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "300px",
    maxWidth: "375px"
  },
  overlay: { zIndex: 10 }
};

const Chat = props => {
  const {
    selectChat,
    selectedChat,
    user,
    userSentChats,
    userReceivedChats,
    seenChats
  } = props;

  const isMobileWidth = window.innerWidth <= 650;
  const [newMessage, updateNewMessage] = useState(null);
  const [isFirstMessage, firstMessageHandler] = useState(false);
  const [currentMessage, updateCurrentMessage] = useState("");
  const [chatHeader, setChatHeader] = useState({
    chatName: "...",
    chatDetails: "..."
  });
  const [mobileChatOpen, setMobileChat] = useState(isMobileWidth);
  const [selectedModal, setModal] = useState(null);
  const [reportInput, setReportInput] = useState("");
  let isMounted = false;

  // on mount check if sending new message
  useEffect(() => {
    isMounted = true;

    // if we are sending a first message
    if (!!window.location.search) {
      // TODO: put this shit in redux
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

    return () => {
      isMounted = false;
      selectChat(null);
    };
  }, []);

  // on selectedChat change, fetch chat user
  useEffect(() => {
    getChatDetails();
  }, [selectedChat]);

  const renderChatPreviews = () => {
    // clear global chat notif
    seenChats();

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
      // get rid of temp create message and URL spam
      firstMessageHandler(false);
      props.history.push({
        search: ""
      });

      const newChat = await firebase.createChat(
        {
          sender: user.id,
          recipient: selectedChat.id,
          post: selectedChat.postId,
          messages: [
            {
              content: currentMessage,
              createdAt: moment().unix(),
              sentBy: user.id,
              isUnread: true
            }
          ]
        },
        true
      );

      // select the new chat
      selectChat(newChat);
    } else {
      firebase.createChat(
        {
          content: currentMessage,
          createdAt: moment().unix(),
          sentBy: user.id,
          isUnread: true
        },
        false,
        selectedChat.id
      );
    }

    updateCurrentMessage("");
  };

  const linkify = inputText => {
    const sanitizedInput = sanitizeHTML(inputText);
    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = sanitizedInput.replace(
      replacePattern1,
      `<a href="$1" target="_blank" rel="noopener noreferrer" class="${
        styles.chatLink
      }">$1</a>`
    );

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(
      replacePattern2,
      `$1<a href="http://$2" target="_blank" rel="noopener noreferrer" class="${
        styles.chatLink
      }">$2</a>`
    );

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(
      replacePattern3,
      `<a href="mailto:$1" class="${styles.chatLink}">$1</a>`
    );

    return { __html: replacedText };
  };

  const renderMessages = () => {
    const { selectedChat } = props;

    if (selectedChat) {
      const messageContainer = document.getElementById("chatMessageArea");
      if (messageContainer) {
        // once messages render, scroll to bottom of messages
        setTimeout(
          () => (messageContainer.scrollTop = messageContainer.scrollHeight),
          100
        );
      }

      return selectedChat.messages.map(message => {
        const wasSender = user && user.id === message.sentBy;
        return (
          <div
            className={[
              styles.singleChatContainer,
              wasSender ? styles.senderPos : styles.receiverPos
            ].join(" ")}
            key={message.createdAt + message.sentBy}
          >
            <div className={styles.dateContainer}>
              {moment.unix(message.createdAt).format("MMMM DD, h:mm A")}
            </div>
            <div
              className={[
                styles.messageContainer,
                wasSender ? styles.sender : styles.receiver
              ].join(" ")}
              dangerouslySetInnerHTML={linkify(message.content)}
            />
          </div>
        );
      });
    }
  };

  const getChatDetails = async () => {
    if (!user || !selectedChat) return;
    const isSender = selectedChat.sender === user.id || selectedChat.isFirst;
    let chatUser = {};
    let postDetails = {};

    // save an API call if new message from postings
    if (selectedChat.isFirst) {
      chatUser = {
        fullName: selectedChat.fullName
      };
      postDetails = {
        postId: selectedChat.postId,
        bookTitle: selectedChat.bookTitle
      };
    } else if (selectedChat.post.id === "BOOK_BUY") {
      // if message from Book Buy
      setChatHeader({
        chatName: "Book Buy",
        chatDetails: "Find and Sell Used Books Easily! info@bookbuy.ca"
      });
      return;
    } else {
      // TODO: Refactor into a global redux saga so we only have to fetch details once
      [chatUser] = await firebase.getDocsFromCollection("users", [
        ["id", "==", isSender ? selectedChat.recipient : selectedChat.sender]
      ]);

      [postDetails] = await firebase.getDocsFromCollection("postings", [
        ["postId", "==", selectedChat.post]
      ]);
    }

    const postingLink = `${
      process.env.NODE_ENV === "development" ? "" : "https://"
    }${window.location.host}/postings?id=${postDetails.postId}`;
    const chatDetails = (
      <div>
        {isSender
          ? "You are interested in their book: "
          : "They are interested in your book: "}
        <a
          href={postingLink}
          rel="noopener"
          target="_blank"
          className={styles.bookLink}
        >
          {postDetails.bookTitle}
        </a>
      </div>
    );

    setChatHeader({
      chatName: chatUser.fullName,
      chatDetails
    });
  };

  const deleteChatHandler = async () => {
    setModal(null);
    selectChat(null);

    if (isFirstMessage) {
      firstMessageHandler(false);
      props.history.push({
        search: ""
      });
      return;
    }

    try {
      await firebase.deleteDocument("messages", selectedChat.id);
    } catch (error) {
      console.error("Delete Chat Error", error);
    }
  };

  const reportUserHandler = async () => {
    const newChat = await firebase.createDocument("reports", {
      dateReported: moment().unix(),
      chatId: selectedChat.id,
      reportNotes: reportInput,
      reportedUserId:
        user.id === selectedChat.sender
          ? selectedChat.recipient
          : selectedChat.sender,
      reporterUserId: user.id
    });

    setModal(null);
  };

  const numChats = [...userSentChats, ...userReceivedChats].length;

  return (
    <div className={styles.mainChatContainer}>
      <Modal
        isOpen={!!selectedModal}
        onRequestClose={() => setModal(null)}
        style={modalStyles}
        contentLabel="Report or Delete Post"
      >
        {selectedModal === "delete" ? (
          <>
            <div className={styles.modalTitleText}>
              Are you sure you want to delete this chat?
            </div>
            <div className={styles.confirmText}>
              This removes the chat forever. Forever is a very long time.
            </div>
            <div className={styles.confirmContainer}>
              <div
                className={styles.confirmButton}
                onClick={() => setModal(null)}
              >
                No
              </div>
              <div className={styles.confirmButton} onClick={deleteChatHandler}>
                Yes
              </div>
            </div>
          </>
        ) : isFirstMessage ? (
          <>
            <div className={styles.modalTitleText}>
              You can only report messages that have already been sent
            </div>
            <div
              className={styles.confirmButton}
              onClick={() => setModal(null)}
            >
              Close
            </div>
          </>
        ) : (
          <>
            <div className={styles.modalTitleText}>
              Would you like to report this User?
            </div>
            <div className={styles.reportText}>
              Report a user if they make you feel uncomfortable or unsafe in
              anyway. The report will be reviewed by a member of our team and
              acted upon accordingly.
            </div>
            <textarea
              placeholder="Enter any report notes"
              className={styles.reportInput}
              onChange={event => setReportInput(event.target.value)}
              value={reportInput}
            >
              Enter any report notes
            </textarea>
            <div className={styles.confirmContainer}>
              <div
                className={styles.confirmButton}
                onClick={() => setModal(null)}
              >
                No
              </div>
              <div className={styles.confirmButton} onClick={reportUserHandler}>
                Yes
              </div>
            </div>
          </>
        )}
      </Modal>
      <div className={styles.header}>Messaging</div>
      <div className={styles.contentContainer}>
        <div
          className={[
            styles.chatOverview,
            mobileChatOpen ? styles.mobileChatToggle : null
          ].join(" ")}
        >
          <div
            className={[
              styles.chatsHeader,
              mobileChatOpen ? styles.chatsHeaderToggle : null
            ].join(" ")}
          >{`${numChats} Active Chats`}</div>
          <div style={{ display: "flex" }}>
            <div className={styles.chatsContainer}>{renderChatPreviews()}</div>
            {isMobileWidth && (
              <div
                className={styles.chatsToggle}
                onClick={() => setMobileChat(!mobileChatOpen)}
              >
                {mobileChatOpen ? "Close Chats" : "Open Chats"}
              </div>
            )}
          </div>
        </div>
        <div className={[styles.activeChat].join(" ")}>
          {selectedChat ? (
            <div className={styles.chatHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.chatName}>
                  {selectedChat.fullName
                    ? selectedChat.fullName
                    : chatHeader.chatName}
                </div>
                <div className={styles.chatDetails}>
                  {chatHeader.chatDetails}
                </div>
              </div>
              <div className={styles.headerRight}>
                {selectedChat.post.id !== "BOOK_BUY" && (
                  <FaFlag
                    className={styles.chatIcons}
                    onClick={() => setModal("report")}
                  />
                )}
                <FaTrashAlt
                  className={styles.chatIcons}
                  onClick={() => setModal("delete")}
                />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              {numChats === 0 ? "No current chats" : "Select a Chat!"}
            </div>
          )}
          <div className={styles.chatMessageArea} id="chatMessageArea">
            {renderMessages()}
          </div>
          {selectedChat && (
            <form className={styles.chatForm}>
              <textarea
                className={styles.chatInput}
                id="chatInput"
                type="text"
                placeholder="Type your message here!"
                value={currentMessage}
                onChange={e => updateCurrentMessage(e.target.value)}
                disabled={!selectedChat}
                spellCheck="true"
              />
              <button
                type="submit"
                className={styles.chatSendButton}
                onClick={onChatSend}
                disabled={!currentMessage}
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.authState.user,
  selectedChat: state.interfaceState.selectedChat,
  userSentChats: state.userState.userSentChats,
  userReceivedChats: state.userState.userReceivedChats
});

export default connect(
  mapStateToProps,
  { selectChat, seenChats }
)(withRouter(Chat));
