import React from "react";
import { Route, Switch } from "react-router";
import Loadable from "react-loadable";
import Loading from "./components/loading";

interface IRoute {
  title: string;
  path?: string;
  component: () => any;
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
  },
  {
    title: "404",
    component: () => import("./components/404")
  }
];

let mainViewsJSX = routes.map((item, index) => {
  return (
    <Route
      key={index}
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
    <Switch>{mainViewsJSX}</Switch>
  </div>
);
