import {Redirect, Route} from 'react-router-dom'
import React from 'react'


export default function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/production', state: {from: props.location}}} />}
    />
  )
}