import React from "react";
import EthNodeActive from './EthNodeActive';
import AccountStatus from './AccountStatus';
import EventBus from 'EventBusAlias';

export default class CxnStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      cxnActive: false,
      network: '',
      accountActive: false,
      address: '',
      addressProvider: '',
    };

    // Bind internal events
    this.handleConnectionUpdate = this.handleConnectionUpdate.bind(this);
    this.handleAccountUpdate = this.handleAccountUpdate.bind(this);
    // Bind external events
    EventBus.on(EventBus.tag.ConnectionUpdate,this.handleConnectionUpdate);
    EventBus.on(EventBus.tag.AccountUpdate,this.handleAccountUpdate);
  }

  handleConnectionUpdate(data) {
    let cxnActive = data.active;
    let network = data.network;
    if (cxnActive != this.state.cxnActive) {
      this.setState({cxnActive});
      this.setState({network});
    }
  }

  handleAccountUpdate(data) {
    let accountActive = data.active;
    let address = data.address;
    let addressProvider = data.addressProvider
    if (accountActive != this.state.accountActive) {
      this.setState({accountActive});
      this.setState({address});
      this.setState({addressProvider});
    }
  }

  handleClick(e) {
    let cxnActive = !this.state.cxnActive ? 1 : 0;
    this.setState({cxnActive});
  }

  render() {
    return (
      <div>
        <EthNodeActive
        cxnActive={this.state.cxnActive}
        network={this.state.network}
        />
        <AccountStatus
        accountActive={this.state.accountActive}
        address={this.state.address}
        addressProvider={this.state.addressProvider}
        />
      </div>
    );
  }
}
