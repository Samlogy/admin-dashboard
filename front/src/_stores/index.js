import { createStore } from 'redux';

import { loadState } from "../Components/localStorage";
import rootReducer from "../_reducers"


/* Store Login */
const persistedState = loadState("auth-admin")
let initAuthState;

if (persistedState === undefined) {
    initAuthState = {
        logged: false,
        userData: {}
    }
} else {
    initAuthState = persistedState
}

export const createAuthStore = createStore(
    rootReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    // persistedState
  );