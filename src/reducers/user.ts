import { getType } from "typesafe-actions";
import { userActions, UserAction, IBaseAction } from "@actions";

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
      let {
        payload: { name, avatar_url }
      } = action as IBaseAction<IUserState>;
      return {
        ...state,
        name,
        avatar_url
      };
    default:
      return state;
  }
}
