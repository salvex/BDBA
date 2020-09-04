import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ( {component: Component, auth, ...rest} ) => (
    <Route 
        {...rest}
        render={ props => 
            auth.isLoggedIn ? (
                // Se l'utente ha eseguito l'autenticazione
                <Component auth={auth} {...props} />
            ) : (
                // Se l'utente non è autenticato torna alla Home
                <Redirect to="/" />
            )
        }
    />
);

export default PrivateRoute;