import { createStore, applyMiddleware, Store } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { rootReducer } from "./reducers";
import { rootEpic } from "./epics";

const epicMiddleware = createEpicMiddleware();
const middlewares = [createLogger({ collapsed: true }), epicMiddleware];

const store = (): Store<any> =>
  createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

export default store;

epicMiddleware.run(rootEpic);
