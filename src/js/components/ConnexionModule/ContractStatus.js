import React from "react";

export default class ContractStatus extends React.Component {

  render() {
    // let blockNumber = Math.max(this.props.blockNumber.HTTP, this.props.blockNumber.websocket);
    return (
      <div>
        <a>Contract balance: </a>
        <a>{this.props.contractBalance}</a>
        <a> Block Number: </a>
        <a> HTTP {this.props.blockNumber.HTTP}</a>
        <a> WS {this.props.blockNumber.websocket}</a>
      </div>
    );
  }
}
