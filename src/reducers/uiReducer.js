const initialState = {
  selectedChat: null
};

const uiReducer = (prevState = initialState, { type, payload }) => {
  switch (type) {
    case "SELECT_CHAT":
      return { ...prevState, selectedChat: payload };

    default:
      return prevState;
  }
};

export default uiReducer;
