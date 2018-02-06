import React from "react";

export default class AccountStatus extends React.Component {

  render() {
    let connexionStatusText = this.props.accountActive ? 'Yes' : 'No';
    let addressText = ' '+this.props.address;
    let addressProviderText = ' '+this.props.addressProvider;
    return (
      <div>
        <a>Contract active: </a>
        <a>{connexionStatusText}</a>
        <a>{addressProviderText}</a>
        <a>{addressText}</a>
      </div>
    );
  }
}
