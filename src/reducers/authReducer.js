const initialState = {
  isAuthenticated: false,
  user: null,
  authLoading: true
};

const authReducer = (prevState = initialState, { type, payload }) => {
  switch (type) {
    case "USER_STATUS_RESPONSE":
      if (payload === null) {
        return {
          ...prevState,
          isAuthenticated: false,
          user: {},
          authLoading: false
        };
      }

      return {
        ...prevState,
        isAuthenticated: true,
        user: payload,
        authLoading: false
      };

    default:
      return prevState;
  }
};

export default authReducer;
