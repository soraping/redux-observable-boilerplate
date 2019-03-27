import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import routes from "./routes";
import createStore from "./store";

const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={createStore()}>
    <ConnectedRouter history={history}>{routes}</ConnectedRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
