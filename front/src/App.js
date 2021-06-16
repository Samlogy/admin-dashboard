import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import PrivateRoute from "./Components/PrivateRoute"

import ManageUser from "./Pages/ManageUser/ManageUser.jsx";
import WriteNewsletter from "./Pages/WriteNewsletter/WriteNewsletter.jsx";
import Notifications from "./Pages/Notifications/Notifications.jsx"
import Products from "./Pages/Products/Products.jsx"
import Login from "./Pages/Auth/Login.jsx"
import Home from "./Pages/Home/Home.jsx"
// import ChatRooms from "./ChatRooms.jsx";

import { loadState, saveState } from "./Components/localStorage";
import { logged } from "./_actions/authActions"
import { createAuthStore } from "./_stores"

import './App.css';



export default function App() {
  const authStore = useSelector(state => state.auth)
  // const dispatch = useDispatch()

  createAuthStore.subscribe(() => {
    saveState("auth-admin", {
      logged: createAuthStore.getState().logged,
      userData: createAuthStore.getState().userData,
    });
  });
  
  return (

      <Router>
        <Switch>

            {/* <PrivateRoute path="/home" isLogged={authStore.logged && authStore.logged} component={Home}  />
            <PrivateRoute path="/ManageUser" isLogged={authStore.logged && authStore.logged} component={ManageUser} />
            <PrivateRoute path="/WriteNewsletter" isLogged={authStore.logged && authStore.logged} component={WriteNewsletter} />
            <PrivateRoute path="/Notifications" isLogged={authStore.logged && authStore.logged} component={Notifications}/> 
            <PrivateRoute path="/Products" isLogged={authStore.logged && authStore.logged} component={Products} /> */}

            <Route path="/home" component={Home} />
            <Route path="/writeNewsletter" component={WriteNewsletter} />
            <Route path="/notifications" component={Notifications}/> 
            <Route path="/products" component={Products} />
            <Route path="/manageUser" component={ManageUser} />

            <Route path="/" component={Login} />

            {/* <Route path="*" component={Error404}/> */}
        </Switch>
      </Router>
  );
}
