// Creo un middleware che posso usare per contenere lo stato globale
// della mia App per tracciare informazioni relative all'utente
import { createStore, applyMiddleware } from "redux";
import authReducer from "../Reducers/authReducer";
import ReduxThunk from "redux-thunk";

const middlewares = [ReduxThunk];
const store = createStore(authReducer, applyMiddleware(...middlewares));

export default store;
