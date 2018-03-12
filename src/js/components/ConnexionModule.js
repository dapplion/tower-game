import React from "react";
import EthNodeActive from './ConnexionModule/EthNodeActive';
import AccountStatus from './ConnexionModule/AccountStatus';
import ContractStatus from './ConnexionModule/ContractStatus';
import './APIs/web2contract';
import './APIs/contract2web';
import './APIs/eventPatch';
import './APIs/web3Main';
import './APIs/web3HTTP';
import './APIs/web3ConexionMonitoring';
import EventBus from 'EventBusAlias';
import AppStore from 'Store';

export default class ConnexionModule extends React.Component {
  constructor() {
    super();
    this.state = {
      // Initial states of variables must be defined in the constructor
      cxn: AppStore.getCxnStatus(),
      account: AppStore.getAccountStatus(),
      blockNumber: AppStore.getBlockNumber(),
      contractBalance: 0,
    };
    // Bind internal events
    this.handleConnectionUpdate = this.handleConnectionUpdate.bind(this);
    this.handleAccountUpdate = this.handleAccountUpdate.bind(this);
    this.getCxnStatus = this.getCxnStatus.bind(this);
    this.getAccountStatus = this.getAccountStatus.bind(this);
    this.getContractBalance = this.getContractBalance.bind(this);
    this.getBlockNumber = this.getBlockNumber.bind(this);

    // Bind external events
    EventBus.on(EventBus.tag.ConnectionUpdate,this.handleConnectionUpdate);
    EventBus.on(EventBus.tag.AccountUpdate,this.handleAccountUpdate);
  }

  componentWillMount() {
    AppStore.on(AppStore.tag.CXN.CHANGE, this.getCxnStatus);
    AppStore.on(AppStore.tag.ACCOUNT.CHANGE, this.getAccountStatus);
    AppStore.on(AppStore.tag.BALANCE.CHANGE, this.getContractBalance);
    AppStore.on(AppStore.tag.BLOCKNUMBER.CHANGE, this.getBlockNumber);
  }

  componentWillUnmount() {
    AppStore.removeListener(AppStore.tag.CXN.CHANGE, this.getCxnStatus);
    AppStore.removeListener(AppStore.tag.ACCOUNT.CHANGE, this.getAccountStatus);
    AppStore.removeListener(AppStore.tag.BALANCE.CHANGE, this.getContractBalance);
    AppStore.removeListener(AppStore.tag.BLOCKNUMBER.CHANGE, this.getBlockNumber);
  }

  getCxnStatus() {
    this.setState({
      cxn: AppStore.getCxnStatus()
    });
  }

  getAccountStatus() {
    this.setState({
      account: AppStore.getAccountStatus()
    });
  }

  getContractBalance() {
    this.setState({
      contractBalance: AppStore.getContractBalance()
    });
  }

  getBlockNumber() {
    this.setState({
      blockNumber: AppStore.getBlockNumber()
    });
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

  render() {
    return (
      <div class='header'>
        <EthNodeActive
        cxn={this.state.cxn}
        />
        <AccountStatus
        account={this.state.account}
        />
        <ContractStatus
        contractBalance={this.state.contractBalance}
        blockNumber={this.state.blockNumber}
        />
      </div>
    );
  }
}
