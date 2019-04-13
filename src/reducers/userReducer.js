const initialState = {
  userChats: []
};

const userReducer = (prevState = initialState, { type, payload }) => {
  switch (type) {
    case "GET_USER_CHATS":
      return { ...prevState, userChats: payload };

    default:
      return prevState;
  }
};

export default userReducer;
