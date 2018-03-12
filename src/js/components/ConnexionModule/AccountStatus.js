import React from "react";

export default class AccountStatus extends React.Component {

  render() {
    let connexionStatusText = this.props.account.active ? 'Yes' : 'No';
    let addressText = ' - '+this.props.account.address;
    return (
      <div>
        <a>Account active: </a>
        <a>{connexionStatusText}</a>
        <a>{addressText}</a>
      </div>
    );
  }
}
