// Actions

// Trigger store updates
// =====================

// towerGameInstance, default state = null

// feedback, default state = null
export const updateFeedbackError = text => ({
  type: "UPDATE_FEEDBACK",
  feedback: { type: "danger", text }
});
export const updateFeedbackInfo = text => ({
  type: "UPDATE_FEEDBACK",
  feedback: { type: "info", text }
});
export const updateFeedbackSuccess = text => ({
  type: "UPDATE_FEEDBACK",
  feedback: { type: "success", text }
});

// dx, default state = 0
export const updateDx = dx => ({ type: "UPDATE_DX", dx });

// results, default state = {}
export const updateResult = (id, event) => ({
  type: "UPDATE_RESULT",
  id,
  event
});
export const updateResults = indexedEvents => ({
  type: "UPDATE_RESULTS",
  indexedEvents
});

// network, default state = null
export const updateNetwork = network => ({ type: "UPDATE_NETWORK", network });
export const updateBalance = balance => ({
  type: "UPDATE_NETWORK",
  network: { balance }
});

// gameState, default state = null
export const updateGameState = gameState => ({
  type: "UPDATE_GAME_STATE",
  gameState
});

// gameSettings, default state = {}
export const updateGameSettings = gameSettings => ({
  type: "UPDATE_GAME_SETTINGS",
  gameSettings
});

// Show win modal, default state = {}
export const updateWinModalText = text => ({
  type: "UPDATE_WIN_MODAL",
  data: { text }
});
export const showWinModal = text => ({
  type: "UPDATE_WIN_MODAL",
  data: { show: true, ...(text ? { text } : {}) }
});
export const hideWinModal = () => ({
  type: "UPDATE_WIN_MODAL",
  data: { show: false }
});

// Trigger saga functions
// ======================
export const executePlay = () => ({ type: "EXECUTE_PLAY" });
