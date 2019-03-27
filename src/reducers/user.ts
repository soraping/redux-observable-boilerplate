import { ActionType, getType } from "typesafe-actions";
import { userActions } from "@actions";

type UserAction = ActionType<typeof userActions>;

export interface IUserState {
  name: string;
}

const initialState = {
  name: ""
};

export default function userReducer(
  state: IUserState = initialState,
  action: UserAction
): IUserState {
  switch (action.type) {
    case getType(userActions.setUserInfo):
      return {
        ...state,
        ...action["payload"]
      };
    default:
      return state;
  }
}
