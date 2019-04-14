import { combineEpics } from "redux-observable";
import userEpic from "./userEpics";

const rootEpic = combineEpics(userEpic);

export default rootEpic;
