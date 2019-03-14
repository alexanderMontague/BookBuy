export const getUserStatus = () => ({
  type: "GET_USER_STATUS"
});

export const userStatusResponse = data => ({
  type: "USER_STATUS_RESPONSE",
  payload: data
});
