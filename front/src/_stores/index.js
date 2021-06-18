import { createStore } from 'redux';


import rootReducer from "../_reducers"


export const Store = createStore(
    rootReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    // persistedState
  );