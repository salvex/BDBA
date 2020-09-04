// React
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// React Router:
// Si connette alla history api e mantiene la ui sincronizzata con l'URL
import { BrowserRouter } from 'react-router-dom';

// React Redux
// Si occupa di mantenere gli stati dei componenti in modo efficente
import { Provider } from 'react-redux';

// Material-ui
import ThemeProvider from '@material-ui/styles/ThemeProvider';

// Themes
import Theme from './App/Theme';

// Components
import App from './App';
import store from './App/Store';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
