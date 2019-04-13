import { put, takeLatest, select } from "redux-saga/effects";
import { userStatusResponse } from "../actions/authActions";
import firebase from "../firebase";

// selectors
const getUser = state => state.authState.user;

function* getUserChats() {
  const userStatus = yield firebase.isAuthenticated();

  if (userStatus === null) {
    return;
  }

  const user = yield select(getUser);

  console.log("saga user", user);

  yield firebase.db
    .collection("messages")
    .where("sender", "==", user.id)
    .onSnapshot(
      snapshot => console.log(snapshot.docs.map(doc => doc.data())),
      err => console.error("chat sender error", err)
    );

  yield firebase.db
    .collection("messages")
    .where("recipient", "==", user.id)
    .onSnapshot(
      snapshot => console.log(snapshot.docs.map(doc => doc.data())),
      err => console.error("chat recipient error", err)
    );

  //yield put(userStatusResponse({ ...userData }));
}

export function* userSaga() {
  yield takeLatest("GET_USER_CHATS", getUserChats);
}
