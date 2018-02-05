import React from "react";
import CxnStatus from './ConnexionModule/CxnStatus';

export default class ConnexionModule extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      title: "Change this title below",
    };
  }

  changeTitle(title) {

  }

  handleChange(e) {
    const title = e.target.value;
    this.setState({title});
  }

  render() {
    return (
      <div class='header'>
        <CxnStatus />
      </div>
    );
  }
}
