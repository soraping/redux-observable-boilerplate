import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userActions } from "../actions";
import { IState } from "../reducers";

type PageStateProps = {};

type PageDispatchProps = {
  getGitHubUser: () => void;
};

type PageOwnProps = Pick<IState, "user">;

type PageState = {};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      { getGitHubUser: userActions.getGitHubUser },
      dispatch
    )
  };
};

/**
 * @connect https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9951
 */
@(connect<PageStateProps, PageDispatchProps, PageOwnProps>(
  mapStateToProps,
  mapDispatchToProps
) as any)
export default class User extends Component<IProps, any> {
  render() {
    let { user } = this.props;
    return (
      <div>
        <h3>user</h3>
        <button onClick={this._getUserInfo}>获取用户信息</button>
        <div>name: {user.name}</div>
        <div>头像: </div>
        <img src={user.avatar_url} />
      </div>
    );
  }
  _getUserInfo = () => {
    this.props.getGitHubUser();
  };
}
