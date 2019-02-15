import store from "../store";

window.store = store;

export function put(action) {
  store.dispatch(action);
}
