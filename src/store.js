import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createEpicMiddleware } from "redux-observable";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import rootEpic from "./epics";

// saga middleware
const sagaMiddleware = createSagaMiddleware();

// observable middleware
const epicMiddleware = createEpicMiddleware();

// dev tool middleware
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// set up store with middleware
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, epicMiddleware))
);

sagaMiddleware.run(rootSaga);
epicMiddleware.run(rootEpic);

export default store;
