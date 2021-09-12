import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"


import { Home, Notifications, Login, WriteNewsletter, Users, Products, NotFound, Contacts, Reports } from "../Pages"
import PrivateRoute from "../utils/PrivateRoute";



function Routing() {
  
  
  return (

      <Router>
        <Switch>
            <Route path="/" exact component={Login} />

            <PrivateRoute path="/home" component={Home}  />
            <PrivateRoute path="/users" component={Users} />
            <PrivateRoute path="/newsletter" component={WriteNewsletter} />
            <PrivateRoute path="/notifications" component={Notifications}/> 
            <PrivateRoute path="/products" component={Products} />
            <PrivateRoute path="/contacts" component={Contacts} />
            <PrivateRoute path="/reports" component={Reports} />

            <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
  );
}

export default Routing;