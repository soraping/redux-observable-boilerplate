import { combineReducers } from "redux";
import { History } from "history";
import { RouterState, connectRouter } from "connected-react-router";
import { StateType } from "typesafe-actions";
import userReducer from "./user";

export type UserState = StateType<typeof userReducer>;

export interface IState {
  router: RouterState;
  user: UserState;
  [P: string]: any;
}

export const rootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer
  });
