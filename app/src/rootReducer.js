import { combineReducers } from "redux";

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
  results: (state = {}, action) => {
    switch (action.type) {
      case "UPDATE_RESULT":
        return {
          ...state,
          [action.id]: action.event
        };
      case "UPDATE_RESULTS":
        return {
          ...state,
          ...action.indexedEvents
        };
      default:
        return state;
    }
  },
  network: (state = null, action) => {
    switch (action.type) {
      case "UPDATE_NETWORK":
        return {
          ...state,
          ...action.network
        };
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
          ...action.gameSettings
        };
      default:
        return state;
    }
  },
  winModal: (state = {}, action) => {
    switch (action.type) {
      case "UPDATE_WIN_MODAL":
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
