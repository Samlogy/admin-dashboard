import { createStore } from 'redux';

import { loadState } from "../Components/localStorage";
import rootReducer from "../_reducers"


/* Store Login */
// let initAuthState = {
//     logged: false,
//     userData: {}
// }

export const createAuthStore = createStore(
    rootReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    // persistedState
  );