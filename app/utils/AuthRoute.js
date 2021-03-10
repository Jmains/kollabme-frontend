import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "../context/auth";
// Route user to home if they try to go to register or login when alread logged in
function AuthRoute({ component: Component, ...rest }) {
  const { user } = useAuthState();

  return (
    <Route
      {...rest}
      render={(props) => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  );
}

export default AuthRoute;
