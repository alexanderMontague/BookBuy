import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
// import { updateUserChats } from "../actions/userActions";
import firebase from "../firebase";

const userEpic = action$ =>
  action$.pipe(
    filter(action => action.type === "GET_USER_CHATS"),
    map(action => {
      console.log("rxjs action", action);

      let newMessages = [];

      return { type: "FETCHED_CHATS", payload: newMessages };
    })
  );

export default userEpic;
