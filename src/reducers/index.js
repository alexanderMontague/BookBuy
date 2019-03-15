import { combineReducers } from "redux";
import authState from "./authReducer";

const rootReducer = combineReducers({
  authState
});

export default rootReducer;
