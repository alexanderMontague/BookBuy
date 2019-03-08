import React from "react";
import { Switch, Route } from "react-router";

import Layout from "./containers/Layout";
import Home from "./containers/Home";
import Postings from "./containers/Postings";

const DefaultComponent = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={componentProps => (
        <Layout>
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
  </Switch>
);

export default routes;
