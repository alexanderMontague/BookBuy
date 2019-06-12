export const selectChat = chatInfo => ({
  type: "SELECT_CHAT",
  payload: chatInfo
});

export const redirectToProfile = shouldRedirect => ({
  type: "GOTO_PROFILE",
  payload: shouldRedirect
});
