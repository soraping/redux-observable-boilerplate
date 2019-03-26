import { USER } from "@constants";
import { createAction } from "typesafe-actions";

export namespace userActions {
  export const getGitHubUser = createAction(USER.GITHUB_USER_API);

  export const setUserInfo = createAction(USER.SET_USER_INFO, resolve => user =>
    resolve(user)
  );
}
