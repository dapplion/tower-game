import React from "react";

export default class EthNodeActive extends React.Component {

  render() {
    let connexionStatusText = this.props.cxn.active ? 'Yes' : 'No';
    let connexionNetworkText = ' - '+this.props.cxn.network;
    let networkSupportText;
    if (this.props.cxn.active) {
      if (this.props.cxn.contractAddress) {
        networkSupportText = ' (supported)';
      } else {
        networkSupportText = ' (NOT supported)';
      }
    } else {
      networkSupportText = '';
    }
    return (
      <div>
        <a>Conexion active: </a>
        <a>{connexionStatusText}</a>
        <a>{connexionNetworkText}</a>
        <a>{networkSupportText}</a>
      </div>
    );
  }
}
