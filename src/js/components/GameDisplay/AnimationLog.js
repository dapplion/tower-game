import React from 'react';
import AppStore from 'Store';

class ProductRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.dataElem.TXid.toLowerCase()}</td>
        <td>{this.props.dataElem.dx}</td>
        <td>{this.props.dataElem.msg}</td>
      </tr>
    );
  }
}

export default class AnimationLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationLog: AppStore.getAnimationLog()
    };

    // Bind internal events
    this.getAnimationLog = this.getAnimationLog.bind(this);
    // Bind external events
    // EventBus.on(EventBus.tag.countUpdate,this.handleCountChange);
    // EventBus.on(EventBus.tag.dxsUpdate,this.handleDxsChange);
  }

  componentWillMount() {
    AppStore.on(AppStore.tag.EVENT.CHANGE, this.getAnimationLog);
  }

  componentWillUnmount() {
    AppStore.removeListener(AppStore.tag.EVENT.CHANGE, this.getAnimationLog);
  }

  getAnimationLog() {
    let animationLog = AppStore.getAnimationLog();
    this.setState({animationLog});
  }

  render() {
    let rows = [];
    this.state.animationLog.forEach((dataElem) => {
      rows.push(
        <ProductRow
          dataElem={dataElem}
          key={dataElem.TXid}
        />
      );
    });

    return (
      <div>
        <h2>Animation Log</h2>
        <table class='gameDisplayTable'>
          <thead>
            <tr>
              <th>TXid</th>
              <th>dx</th>
              <th>msg</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}
