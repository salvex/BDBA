// React
import React from 'react';

// React Router 
import { Switch, Route } from 'react-router-dom';

// Material-ui
// --> Components
import { Grid } from '@material-ui/core';

// Components
import Home from './Components/Home';

const App = () => {
  return (
    <Grid container>
      <Switch>
        <Route component={Home} exact path="/" />
      </Switch>
    </Grid>
  );
}

export default App;