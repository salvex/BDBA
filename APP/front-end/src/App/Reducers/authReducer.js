// I reducers di Redux dicono come lo stato debba cambiare
import * as types from "../Actions/types";

const initialState = {
  email: "",
  isLoggedIn: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_LOGIN:
      return {
        ...state,
        email: action.email,
        isLoggedIn: true
      };
    case types.AUTH_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
