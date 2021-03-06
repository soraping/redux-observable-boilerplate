import { ofType, ActionsObservable, Epic } from "redux-observable";
import { throwError } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { getType } from "typesafe-actions";
import { userActions, UserAction } from "@actions";
import { UserState } from "@reducers";

const url = "https://api.github.com/users/soraping";

export const userEpic: Epic<UserAction, UserAction, UserState> = (
  action$: ActionsObservable<any>
) =>
  action$.pipe(
    ofType(getType(userActions.getGitHubUser)),
    switchMap(() => {
      return ajax.getJSON(url).pipe(
        map(res => userActions.setUserInfo(res)),
        catchError(err => throwError(err))
      );
    })
  );
