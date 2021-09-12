import { createStore, combineReducers } from 'redux';

import authReducer from './reducers/authReducer'
import { loadState, saveState } from '../utils/localStorage';

// combine all reducer in a single store
const rootReducer = combineReducers({
    auth: authReducer,
})

// create persisted Auth
const persistedAuth = loadState("auth-admin")
const store = createStore(rootReducer, persistedAuth)

store.subscribe(() => {
  saveState("auth-admin", {
    auth: store.getState().auth,
  });
});

export default store;

// window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()