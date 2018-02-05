import React from "react";

export default class Button extends React.Component {
  constructor() {
    super();
    this.state = {name: 'Will'}
  }
  render() {
    return (
      <div>
        <button id={this.props.btnId} class='bttn'>{this.props.btnId}</button>
      </div>
    );
  }
}
