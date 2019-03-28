import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";
import { createBrowserHistory } from "history";
import { rootReducer } from "./reducers";
import { rootEpic } from "./epics";

export const history = createBrowserHistory();

const epicMiddleware = createEpicMiddleware();

const middlewares = [
  createLogger({ collapsed: true }),
  epicMiddleware,
  routerMiddleware(history)
];

export default createStore(
  rootReducer(history),
  composeWithDevTools(applyMiddleware(...middlewares))
);

// run 方法一定要在 createStore 方法之后
epicMiddleware.run(rootEpic);
