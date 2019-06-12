import { put, takeLatest, select } from "redux-saga/effects";
import { userStatusResponse } from "../actions/authActions";
import firebase from "../firebase";

function* getUserStatus() {
  const gotoProfile = yield select(state => state.interfaceState.gotoProfile);
  const userStatus = yield firebase.isAuthenticated();

  if (userStatus === null) {
    return yield put(userStatusResponse(null));
  }

  const userData = (yield firebase.getCurrentUserInfo()).data();
  yield put(userStatusResponse({ ...userData }));

  console.log("here boi2", gotoProfile);

  if (gotoProfile) {
    console.log("here boi", gotoProfile);

    window.location.href = `${window.location.host}/profile`;
  }
}

export function* authSaga() {
  yield takeLatest("GET_USER_STATUS", getUserStatus);
}
