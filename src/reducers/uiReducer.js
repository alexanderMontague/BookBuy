const initialState = {
  selectedChat: null,
  gotoProfile: false,
  isMobile: window.innerWidth <= 550 ? true : false
};

const uiReducer = (prevState = initialState, { type, payload }) => {
  switch (type) {
    case "SELECT_CHAT":
      return { ...prevState, selectedChat: payload };

    case "GOTO_PROFILE":
      return { ...prevState, gotoProfile: payload };

    default:
      return prevState;
  }
};

export default uiReducer;
