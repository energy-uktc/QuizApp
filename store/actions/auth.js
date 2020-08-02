import * as authService from "../../service/authService";

export const AUTHENTICATE = authService.AUTHENTICATE;
export const LOGOUT = authService.LOGOUT;

export const storeAuthentication = (userId) => {
  return {
    type: AUTHENTICATE,
    userId: userId,
  };
};

export const logout = () => {
  return async (dispatch) => {
    await authService.logout();
    dispatch({ type: LOGOUT });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const userId = await authService.signUp(email, password);
    dispatch(storeAuthentication(userId));
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const userId = await authService.login(email, password);
    dispatch(storeAuthentication(userId));
  };
};
