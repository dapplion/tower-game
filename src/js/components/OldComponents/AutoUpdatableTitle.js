import React from "react";
import Title from './Header/Title';

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      title: "Change this title below",
    };
  }

  handleChange(e) {
    const title = e.target.value;
    this.setState({title});
  }

  render() {
    return (
      <div class='header'>
        <Title title={this.state.title} />
        <input value={this.state.title} onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}
