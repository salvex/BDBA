// props
import * as types from './types';
import history from '../History';

// axios
import axios from 'axios';

// Scrivo i metodi per effettuare il cambio di stato
// Li userò con Redux per farne il "dispatch" e passare
// lo stato alla thunk contenente il mio stato globale
const userLogin = email => ({
    type: types.AUTH_LOGIN,
    email,
});

const userLogout = () => ({
    type: types.AUTH_LOGOUT
});

const loginRequest = ( email, password ) => {
    axios({
        method: 'post',
        url: 'http://localhost:3001/logni',
        data: {
            email: email,
            password: password
        }
    })
        .then( res => console.log(res.data) )
        .catch( err => console.log('Errore nel login: ', err));
}

// Creo i metodi di login e logout
export const doLogin = ( email, password ) => async dispatch => {
    try {
        const userResponse = await loginRequest( email, password );

        // Passo i dati allo stato userLogin
        // e spedisco (dispatch) i dati al mio
        // stato.
        dispatch(userLogin(userResponse));

        // Reindirizzo l'utente alla dashboard
        history.push("/dashboard");

    } catch (err) {
        alert(err);
    }
};

export const doLogout = () => dispatch => {
    dispatch(userLogout());
};