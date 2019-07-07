import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { selectChat } from "../../actions/uiActions";
import { seenChats } from "../../actions/userActions";
import ChatPreview from "../ChatPreview";
import { withRouter } from "react-router";
import firebase from "../../firebase";
import moment from "moment";
import sanitizeHTML from "sanitize-html";

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
  const [chatHeader, setChatHeader] = useState("...");
  const [chatMeetingSpot, setChatMeetingSpot] = useState("");
  const [meetingTimer, setMeetingTimer] = useState(null);
  const [mobileChatOpen, setMobileChat] = useState(isMobileWidth);
  let isMounted = false;

  // on mount check if sending new message
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

    return () => {
      isMounted = false;
      selectChat(null);
    };
  }, []);

  // on selectedChat change, fetch chat user
  useEffect(() => {
    getChatDetails();
  }, [selectedChat]);

  // on meeting spot change, update 10s after initial typing once
  useEffect(() => {
    clearTimeout(meetingTimer);

    // update meeting message 10s after initial typing
    selectedChat &&
      setMeetingTimer(
        setTimeout(() => {
          firebase.updateDocument("messages", selectedChat.id, {
            meetingSpot: chatMeetingSpot
          });
        }, 5000)
      );
  }, [chatMeetingSpot]);

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
          meetingSpot: null,
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
        // holy hack T_T
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
            >
              {/* {message.content} */}
            </div>
          </div>
        );
      });
    }
  };

  const getChatDetails = async () => {
    if (!user || !selectedChat) return;

    const isSender = selectedChat.sender === user.id;

    // TODO: Refactor into a global redux saga so we only have to fetch details once
    const chatName = await firebase.getDocsFromCollection("users", [
      ["id", "==", isSender ? selectedChat.recipient : selectedChat.sender]
    ]);
    const chatMeetingSpot = await firebase.getDocsFromCollection("messages", [
      ["id", "==", selectedChat.id]
    ]);

    setChatHeader(chatName[0].fullName);
    chatMeetingSpot.length !== 0 &&
      setChatMeetingSpot(
        chatMeetingSpot[0].meetingSpot ? chatMeetingSpot[0].meetingSpot : ""
      );
  };

  const numChats = [...userSentChats, ...userReceivedChats].length;

  return (
    <div className={styles.mainChatContainer}>
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
                onChange={event => setChatMeetingSpot(event.target.value)}
                value={chatMeetingSpot}
              />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              {numChats === 0 ? "No current chats" : "Select a Chat!"}
            </div>
          )}
          <div className={styles.chatMessageArea} id="chatMessageArea">
            {renderMessages()}
          </div>
          <form className={styles.chatForm}>
            <input
              className={styles.chatInput}
              type="text"
              placeholder="Type your message here!"
              value={currentMessage}
              onChange={e => updateCurrentMessage(e.target.value)}
              disabled={!selectedChat}
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
