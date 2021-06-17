import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { useSelector } from "react-redux"

import { Home, Notifications, Login, WriteNewsletter, ManageUser, Products, NotFound } from "./Pages"

import PrivateRoute from "./utils/PrivateRoute"
import { saveState } from "./utils/localStorage";
import { createAuthStore } from "./_stores"

import './App.css';


export default function App() {
  const authStore = useSelector(state => state.auth)

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
            <Route path="/" exact component={Login} />

            <Route path="/home" component={Home} />
            <Route path="/newsletter" component={WriteNewsletter} />
            <Route path="/notifications" component={Notifications}/> 
            <Route path="/products" component={Products} />
            <Route path="/users" component={ManageUser} />

            <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
  );
}
