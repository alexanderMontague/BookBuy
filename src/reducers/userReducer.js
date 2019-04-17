const initialState = {
  userSentChats: [],
  userReceivedChats: [],
  isNewMessage: false,
  isFirstFetch: true
};

const userReducer = (prevState = initialState, { type, payload }) => {
  switch (type) {
    case "UPDATE_USER_SENT_CHATS":
      return { ...prevState, userSentChats: [...payload] };

    case "UPDATE_USER_RECEIVED_CHATS":
      return {
        ...prevState,
        userReceivedChats: [...payload],
        isNewMessage: prevState.isFirstFetch ? false : true,
        isFirstFetch: false
      };

    default:
      return prevState;
  }
};

export default userReducer;
