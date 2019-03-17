import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";

import Routes from "./routes";
import { BrowserRouter as Router, browserHistory } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>{Routes}</Router>
  </Provider>,
  document.getElementById("app")
);
