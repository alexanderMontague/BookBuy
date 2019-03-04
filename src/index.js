import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";

import Routes from "./routes";
import { Router } from "react-router";
import createHashHistory from "history/createHashHistory";

// Styles

const hashHistory = createHashHistory({ basename: process.env.PUBLIC_URL });

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory} basename={process.env.PUBLIC_URL}>
      {Routes}
    </Router>
  </Provider>,
  document.getElementById("app")
);
