import { AUTHENTICATE, REFRESH_TOKEN, LOGOUT } from "../actions/auth";

const initialState = {
  email: "",
  idToken: "",
  userId: "",
  expirationDate: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case AUTHENTICATE:
      return {
        email: action.email,
        idToken: action.idToken,
        userId: action.userId,
        expirationDate: action.expirationDate
      };
    case REFRESH_TOKEN:
      return {
        ...state,
        idToken: action.idToken,
        expirationDate: action.expirationDate
      };
    default:
      return state;
  }
};
