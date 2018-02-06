import React from "react";
import CxnStatus from './ConnexionModule/CxnStatus';
import { getStats, getConstants } from './APIs/contract2web';
import './APIs/web2contract';
import './APIs/eventPatch';

var contractGetter = {
  updateInterval : 250,
  start : function() {
    getConstants();
    this.loop = setInterval(function(){
      getStats();
    }, this.updateInterval);
  },
  stop : function() {
    clearInterval(this.loop);
  }
}

contractGetter.start();

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
