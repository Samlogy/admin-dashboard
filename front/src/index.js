import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from "@chakra-ui/react"

import { createAuthStore } from "./_stores"

import App from './App';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <ChakraProvider>
    <Provider store={createAuthStore}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </ChakraProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
