// React
import React from 'react';

// React Router - history - redux
import { Switch, Route, Router } from 'react-router-dom';
import history from './History';
import { connect } from 'react-redux'; 

// Material-ui
// --> Components
import { Grid } from '@material-ui/core';

// Routes
import Home from './Routes/Home';
import Dashboard from './Routes/Dashboard';
import NoSuchPage from './Routes/NoSuchPage';

// Actions
import { doLogin, doLogout } from './Actions/authAction';

// Components
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';



/* APP */
const App = ( { auth, doLogin, doLogout } ) => {
  return (
    <Router history={history}>
      <Grid container direction="column">
        <Grid item container>
          <Header doLogin={doLogin} doLogout={doLogout} auth={auth} />
        </Grid>

        <Grid item container>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/dashboard" component={Dashboard} auth={auth} />
            <Route component={NoSuchPage} />
          </Switch>
        </Grid>
        
      </Grid>
    </Router>
    
  );
}

// Stato corrente della mia app
const mapStateToProps = state => ({
  auth: state,
});


// Connetto lo stato con i miei componenti
export default connect(
  mapStateToProps,
  { doLogin, doLogout }
)(App);