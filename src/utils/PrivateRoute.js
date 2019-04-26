import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuthenticated = true;

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} exact render={(props) => (
    isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)
