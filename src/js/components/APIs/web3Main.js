import AppStore from 'Store';
import launchWebsocketConnection from './web3Websocket';

AppStore.on(AppStore.tag.NETWORK_CHANGE, launchWebsocketConnection);
