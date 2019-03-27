import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import routes from "./routes";
import createStore, { history } from "./store";

ReactDOM.render(
  <Provider store={createStore}>
    <ConnectedRouter history={history}>{routes}</ConnectedRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
