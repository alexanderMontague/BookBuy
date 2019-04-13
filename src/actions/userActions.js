export const getUserChats = () => ({
  type: "GET_USER_CHATS"
});

export const updateUserChats = data => ({
  type: "UPDATE_USER_CHATS",
  payload: data
});
