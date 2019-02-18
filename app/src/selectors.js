// Selectors

// towerGameInstance, default state = null
export const getTowerGameInstance = state => state.towerGameInstance;

// feedback, default state = null
export const getFeedback = state => state.feedback;

// dx, default state = 0
export const getDx = state => state.dx;

// results, default state = {}
export const getResults = state => state.results;

// network, default state = null
export const getNetwork = state => state.network;
export const getContractAddress = state =>
  (getNetwork(state) || {}).contractAddress;
export const getNetworkLink = state => (getNetwork(state) || {}).link;
export const getBalance = state => (getNetwork(state) || {}).balance;

// gameState, default state = null
export const getGameState = state => state.gameState;

// gameSettings, default state = {}
export const getGameSettings = state => state.gameSettings;
export const getWidth = state => getGameSettings(state).width;
export const getPlayPrice = state => getGameSettings(state).playPrice;

// Show win modal, default state = false
export const getWinModal = state => state.winModal;
export const getWinModalShow = state => (getWinModal(state) || {}).show;
export const getWinModalText = state => (getWinModal(state) || {}).text;
