import { combineReducers } from "redux";

// Define global reducers. This live outside from the module construction
const globalReducers = {
  network: (state = null, action) => {
    switch (action.type) {
      case "UPDATE_NETWORK":
        return action.network;
      default:
        return state;
    }
  },
  gameState: (state = null, action) => {
    switch (action.type) {
      case "UPDATE_GAME_STATE":
        return action.gameState;
      default:
        return state;
    }
  }
};

export default combineReducers(globalReducers);
