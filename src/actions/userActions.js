export const getUserChats = data => ({
  type: "GET_USER_CHATS",
  payload: data
});

export const updateUserSentChats = data => ({
  type: "UPDATE_USER_SENT_CHATS",
  payload: data
});

export const updateUserReceivedChats = data => ({
  type: "UPDATE_USER_RECEIVED_CHATS",
  payload: data
});

export const seenChats = () => ({
  type: "CHATS_SEEN"
});
