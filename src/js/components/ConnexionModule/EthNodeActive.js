import React from "react";


export default class EthNodeActive extends React.Component {

  render() {
    let connexionStatusText = this.props.cxnActive ? 'Yes - ' : 'No ';
    let connexionNetworkText = this.props.network;
    return (
      <div>
        <a>Conexion active: </a>
        <a>{connexionStatusText}</a>
        <a>{connexionNetworkText}</a>
      </div>
    );
  }
}
