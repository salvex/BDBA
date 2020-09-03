// React
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// React Router
import { BrowserRouter } from 'react-router-dom';

// Material-ui
import ThemeProvider from '@material-ui/styles/ThemeProvider';

// Themes
import Theme from './App/Theme';

// Components
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
