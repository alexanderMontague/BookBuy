import { combineReducers } from "redux";
import authState from "./authReducer";
import interfaceState from "./uiReducer";

const rootReducer = combineReducers({
  authState,
  interfaceState
});

export default rootReducer;
