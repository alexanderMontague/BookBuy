import React from "react";
import { Switch, Route } from "react-router";

import Layout from "./containers/Layout";
import Home from "./containers/Home";
import Postings from "./containers/Postings";
import Auth from "./containers/Auth";
import Profile from "./containers/Profile";
import Sell from "./containers/Sell";

const DefaultComponent = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={componentProps => (
        <Layout {...componentProps}>
          <Component {...componentProps} />
        </Layout>
      )}
    />
  );
};

const routes = (
  <Switch>
    <DefaultComponent exact path={"/"} component={Home} />
    <DefaultComponent path={"/postings"} component={Postings} />
    <DefaultComponent path={"/auth"} component={Auth} />
    <DefaultComponent path={"/profile"} component={Profile} />
    <DefaultComponent path={"/sell"} component={Sell} />
  </Switch>
);

export default routes;
