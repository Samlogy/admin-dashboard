import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { useSelector } from "react-redux"

import ManageUser from "./Pages/ManageUser/ManageUser.jsx";
import WriteNewsletter from "./Pages/WriteNewsletter/WriteNewsletter.jsx";
import Notifications from "./Pages/Notifications/Notifications.jsx"
import Products from "./Pages/Products/Products.jsx"
import Login from "./Pages/Auth/Login.jsx"
import Home from "./Pages/Home/Home.jsx"
// import ChatRooms from "./ChatRooms.jsx";

import './App.css';


export default function App() {
  const authStore = useSelector(state => state.auth)
  
  return (

      <Router>
        <Switch>
            { authStore.logged ? 
                <>
                  <Route path="/Home" component={Home} />
                  <Route path="/ManageUser" component={ManageUser} />
                  <Route path="/WriteNewsletter" component={WriteNewsletter} />

                  <Route path='/Notifications' component={Notifications}/> 
                  <Route path="/Products" component={Products} />
                </>
                :
                <Route path="/" component={Login} />
            }

            {/* <Route path='*' component={Error404}/> */}
        </Switch>
      </Router>
  );
}
