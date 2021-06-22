import { createStore } from 'redux';

import rootReducer from "../_reducers"
import { loadState, saveState } from '../utils/localStorage';

const persistedAuth = loadState("auth-admin")
const store = createStore(rootReducer, persistedAuth)

store.subscribe(() => {
  saveState("auth-admin", {
    auth: store.getState().auth,
  });
});

export default store;

// export const Store = createStore(
//     rootReducer, 
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
//     // persistedState
//   );