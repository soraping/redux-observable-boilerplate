import React, { Component } from "react";

export default class Home extends Component<any, any> {
  render() {
    return (
      <div>
        <h3>home</h3>
        <button onClick={() => this.props.history.push("/user")}>
          个人中心
        </button>
      </div>
    );
  }
}
