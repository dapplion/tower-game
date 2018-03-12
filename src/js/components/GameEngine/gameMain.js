import React from 'react';
import { render } from 'react-dom';
import EventBus from 'EventBusAlias';
import matterjsScriptPendulums from './matterjsScriptPendulums';
import matterScriptCoins from './matterScriptCoins';
import KonvaReactComponent from './konvaReactComponent';
// import { box2d } from 'Lib/box2dConfig';


export default class GameApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedCoins: {}
    }
    // Bind internal events
  }
  componentDidMount() {
    console.log('this.props',this.props)
    let DOMref = document.getElementById('container')
    matterScriptCoins(DOMref);
  }

  render() {
    return (
      <div>
        <div id="container">
        </div>
      </div>
    );
  }
}
