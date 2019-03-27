import { combineReducers } from "redux";
import { History } from "history";
import { RouterState, connectRouter } from "connected-react-router";
import userReducer, { IUserState } from "./user";

export interface IState {
  router: RouterState;
  user: IUserState;
  [P: string]: any;
}

export const rootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer
  });
