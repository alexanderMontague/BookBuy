import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { updateUserChats } from "../actions/userActions";

const userEpic = action$ =>
  action$.pipe(
    filter(action => action.type === "GET_USER_CHATS"),
    map(action => {
      console.log("Observed GET_CHATS");
      return { type: "FETCHED_CHATS" };
    })
  );

export default userEpic;
