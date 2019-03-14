const initialState = {
  isAuthenticated: false,
  user: null
};

const authReducer = (prevState = initialState, { type, payload }) => {
  switch (type) {
    case "USER_STATUS_RESPONSE":
      return { ...prevState };
  }
};
