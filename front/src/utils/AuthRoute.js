import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useSelector } from "react-redux"


const AuthRoute = ({ component: Component, ...rest }) => {
    const authStore = useSelector(state => state.auth);

    const { isLogged, userData } = authStore;
    const isPerson = auth.user_data.type === ACCOUNT_TYPE_PERSON;


  return (
    <Route
      {...rest}
      component={(props) =>
        isLogged? 
          <Redirect to={isPerson? '/candidate/home' : '/company/home'} /> :
          <Component {...props} />
      }
    />
  );
};
export default AuthRoute;
