import { ActionType, getType } from "typesafe-actions";
import { userActions } from "@actions";

type UserAction = ActionType<typeof userActions>;

export interface IUserState {
  name: string;
  avatar_url: string;
}

const initialState = {
  name: "",
  avatar_url: ""
};

export default function userReducer(
  state: IUserState = initialState,
  action: UserAction
): IUserState {
  switch (action.type) {
    case getType(userActions.setUserInfo):
      return {
        ...state,
        name: action["payload"]["name"],
        avatar_url: action["payload"]["avatar_url"]
      };
    default:
      return state;
  }
}
