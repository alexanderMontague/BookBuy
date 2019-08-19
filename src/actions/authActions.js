export const getUserStatus = payload => ({
  type: "GET_USER_STATUS",
  payload
});

export const userStatusResponse = data => ({
  type: "USER_STATUS_RESPONSE",
  payload: data
});
