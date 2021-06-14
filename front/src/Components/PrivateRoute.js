import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({
    component: Component, isLogged, userLevel, ...rest 
    }) => (
        <Route {...rest} component={(props) => isLogged ? <Component {...props} /> : <Redirect to="/login" />
    } />
)
export default PrivateRoute 