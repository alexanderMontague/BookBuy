import { combineReducers } from "redux";
import authState from "./authReducer";
import interfaceState from "./uiReducer";
import userState from "./userReducer";

const rootReducer = combineReducers({
  authState,
  interfaceState,
  userState
});

export default rootReducer;
