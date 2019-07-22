import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import ReactGA from "react-ga";

import Routes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";

ReactGA.initialize("UA-137825522-1");
ReactGA.pageview(window.location.pathname);

ReactDOM.render(
  <Provider store={store}>
    <Router>{Routes}</Router>
  </Provider>,
  document.getElementById("app")
);
