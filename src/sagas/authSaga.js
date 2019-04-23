import { put, takeLatest } from "redux-saga/effects";
import { userStatusResponse } from "../actions/authActions";
import firebase from "../firebase";

function* getUserStatus() {
  const userStatus = yield firebase.isAuthenticated();

  if (userStatus === null) {
    return yield put(userStatusResponse(null));
  }

  const userData = (yield firebase.getCurrentUserInfo()).data();
  yield put(userStatusResponse({ ...userData }));
}

export function* authSaga() {
  yield takeLatest("GET_USER_STATUS", getUserStatus);
}
