import React from 'react'
import { Provider } from 'react-redux';

import ManageUser from "./Pages/ManageUser/ManageUser.jsx";
import WriteNewsletter from "./Pages/WriteNewsletter/WriteNewsletter.jsx";
import Notifications from "./Pages/Notifications/Notifications.jsx"
import Products from "./Pages/Products/Products.jsx"
// import ChatRooms from "./ChatRooms.jsx";

import {createAuthStore} from "./_stores"
import { saveState } from "./Components/localStorage";

import './App.css';


createAuthStore.subscribe(() => {
  saveState("auth", {
    logged: createAuthStore.getState().logged,
    userData: createAuthStore.getState().userData,
  });
});

export default function App() {

  return (
    <Provider store={createAuthStore}>
        <div className="App">
        {/* <ManageUser /> */}
        {/* <WriteNewsletter /> */}
        {/* <Notifications /> */}
        <Products />
      </div>
    </Provider>
  );
}
