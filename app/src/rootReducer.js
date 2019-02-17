import { combineReducers } from "redux";

const demoResults = {
  '0x2734h2h3b4j2h3b4jh23b4jh23': {
    hash: '0x234u234ib23h4bhj23'
  }
}

// Define global reducers. This live outside from the module construction
const globalReducers = {
  towerGameInstance: (state = null, action) => {
    switch (action.type) {
      case "UPDATE_INSTANCE":
        return action.towerGameInstance;
      default:
        return state;
    }
  },
  feedback: (state = null, action) => {
    switch (action.type) {
      case "UPDATE_FEEDBACK":
        return action.feedback;
      default:
        return state;
    }
  },
  dx: (state = 0, action) => {
    switch (action.type) {
      case "UPDATE_DX":
        return action.dx;
      default:
        return state;
    }
  },
  results: (state = {...demoResults}, action) => {
    switch (action.type) {
      case "UPDATE_RESULTS":
        return {
          ...state,
          ...action.data
        };
      default:
        return state;
    }
  },
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
  },
  gameSettings: (state = {}, action) => {
    switch (action.type) {
      case "UPDATE_GAME_SETTINGS":
        return {
          ...state,
          ...action.data
        };
      default:
        return state;
    }
  }
};

export default combineReducers(globalReducers);
