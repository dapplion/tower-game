import React from "react";

export default class CxnStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      cxnActive: 1,
    };
  }

  changeTitle(title) {

  }

  handleClick(e) {
    let cxnActive = !this.state.cxnActive ? 1 : 0;
    console.log('cxnActive: '+cxnActive)
    this.setState({cxnActive});
  }

  render() {
    return (
      <div>
        <a>Conexion active: </a>
        <a>{this.state.cxnActive}</a>
        <button class='bttnHeader' onClick={this.handleClick.bind(this)} >toggle cxn</button>
      </div>
    );
  }
}
