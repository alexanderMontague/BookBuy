import { put, takeLatest, select } from "redux-saga/effects";
import { userStatusResponse } from "../actions/authActions";
import firebase from "../firebase";

function* getUserStatus({ type, payload }) {
  const gotoProfile = yield select(state => state.interfaceState.gotoProfile);
  const userStatus = yield firebase.isAuthenticated();

  if (userStatus === null) {
    return yield put(userStatusResponse(null));
  }

  const userData = (yield firebase.getCurrentUserInfo()).data();
  yield put(userStatusResponse({ ...userData }));

  // redirect to profile if query param is passed
  if (gotoProfile) {
    payload.history.push({
      pathname: "/profile"
    });
  }
}

export function* authSaga() {
  yield takeLatest("GET_USER_STATUS", getUserStatus);
}
