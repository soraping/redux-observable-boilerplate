import React from "react";
import { Route, Switch } from "react-router";
import Loadable from "react-loadable";
import Loading from "./components/loading";
import NoMatch from "./components/404";

interface IRoute {
  title: string;
  path: string;
  component: () => Promise<
    React.ComponentType<any> | { default: React.ComponentType<any> }
  >;
}

let routes: IRoute[] = [
  {
    title: "首页",
    path: "/",
    component: () => import("./components/home")
  },
  {
    title: "个人中心",
    path: "/user",
    component: () => import("./components/user")
  }
];

let mainViewsJSX = routes.map(item => {
  return (
    <Route
      exact
      path={item.path}
      component={Loadable({
        loader: item.component,
        loading: Loading
      })}
    />
  );
});

export default (
  <div>
    <Switch>
      {mainViewsJSX}
      <Route component={NoMatch} />
    </Switch>
  </div>
);
