import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
  userId: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case AUTHENTICATE:
      return {
        userId: action.userId,
      };
    default:
      return state;
  }
};
