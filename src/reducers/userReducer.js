const initialState = {
  userSentChats: [],
  userReceivedChats: [],
  isNewMessage: false,
  userId: null
};

const userReducer = (prevState = initialState, { type, payload }) => {
  switch (type) {
    case "USER_STATUS_RESPONSE":
      if (payload === null) return prevState;
      return { ...prevState, userId: payload.id };

    case "UPDATE_USER_SENT_CHATS":
      let isNewMessage = false;

      // cycle through messages to see if any are unread
      payload.forEach(chat => {
        chat.messages.forEach(msg => {
          if (msg.sentBy !== prevState.userId && msg.isUnread === true) {
            isNewMessage = true;
          }
        });
      });

      return {
        ...prevState,
        userSentChats: [...payload],
        isNewMessage
      };

    case "UPDATE_USER_RECEIVED_CHATS":
      isNewMessage = prevState.isNewMessage;

      // cycle through messages to see if any are unread
      payload.forEach(chat => {
        chat.messages.forEach(msg => {
          if (msg.sentBy !== prevState.userId && msg.isUnread === true) {
            isNewMessage = true;
          }
        });
      });

      return {
        ...prevState,
        userReceivedChats: [...payload],
        isNewMessage
      };

    case "CHATS_SEEN":
      return { ...prevState, isNewMessage: false };

    default:
      return prevState;
  }
};

export default userReducer;
