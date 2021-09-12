import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from "react-redux"

const PrivateRoute = ({ component: Component, ...rest }) => {

    const authStore = useSelector(state => state.auth);
    const isLogged = authStore.logged;

    return(
        <Route {...rest} 
            component={(props) => isLogged ? 
                <Component {...props} /> : <Redirect to="/login" />} />
    )
}

export default PrivateRoute;

