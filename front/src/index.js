import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createAuthStore } from "./_stores"
import { saveState } from "./Components/localStorage";

import App from './App';
import reportWebVitals from './reportWebVitals';

createAuthStore.subscribe(() => {
  saveState("auth-admin", {
    logged: createAuthStore.getState().logged,
    userData: createAuthStore.getState().userData,
  });
});

ReactDOM.render(
  <Provider store={createAuthStore}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
