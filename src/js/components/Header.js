import React from "react";
import Title from './Header/Title';

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      title: "Ethereum tower",
    };
  }

  render() {
    return (
      <div class='header'>
        <Title title={this.state.title} />
      </div>
    );
  }
}
