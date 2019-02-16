export const updateDx = dx => ({ type: "UPDATE_DX", dx });
export const executePlay = () => ({ type: "EXECUTE_PLAY" });
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
