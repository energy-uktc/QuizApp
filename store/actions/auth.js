import { AsyncStorage } from "react-native";
import USER_DATA from "../../constants/userData";

export const AUTHENTICATE = "AUTHENTICATE";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const LOGOUT = "LOGOUT";
const APIKEY = "AIzaSyA3-zdsJoqNnNdhVXTV7K4Iu5wlloaaORc";

export const storeAuthentication = (idToken, userId, email, expirationDate) => {
  return {
    type: AUTHENTICATE,
    email: email,
    idToken: idToken,
    userId: userId,
    expirationDate: expirationDate
  };
};

export const logout = () => {
  return async dispatch => {
    await AsyncStorage.removeItem(USER_DATA);
    dispatch({ type: LOGOUT });
  };
};
export const refreshToken = refreshToken => {
  return async dispatch => {
    const requestDate = new Date();

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let message = "Something went wrong";
      switch (errorData.error.message) {
        case "TOKEN_EXPIRED":
          message = "Credentials are no longer valid. Please sign in again.";
          break;
        case "MISSING_REFRESH_TOKEN":
          message = "No refresh token provided.";
          break;
        case "USER_DISABLED":
          message = "The user account has been disabled by an administrator.";
          break;
        case "USER_NOT_FOUND":
          message =
            "The user corresponding to the refresh token was not found.";
          break;
        case "INVALID_REFRESH_TOKEN":
          message = "An invalid refresh token is provided.";
          break;
        case "INVALID_GRANT_TYPE":
          message = "The grant type specified is invalid.";
      }
      throw new Error(message);
    }

    const respData = await response.json();

    const expirationDate = new Date(
      requestDate.getTime() + parseInt(respData.expires_in) * 1000
    ).toISOString();

    dispatch({
      type: REFRESH_TOKEN,
      idToken: respData.id_token,
      expirationDate: expirationDate
    });

    await AsyncStorage.mergeItem(
      USER_DATA,
      JSON.stringify({
        idToken: respData.id_token,
        refreshToken: respData.refresh_token,
        expirationDate: expirationDate
      })
    );
  };
};
export const signup = (email, password) => {
  return async dispatch => {
    const requestDate = new Date();

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let message = "Something went wrong";
      switch (errorData.error.message) {
        case "EMAIL_EXISTS":
          message = "Email already used!";
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          message =
            "We have blocked all requests from this device due to unusual activity. Try again later.";
          break;
      }
      throw new Error(message);
    }

    const respData = await response.json();

    const expirationDate = new Date(
      requestDate.getTime() + parseInt(respData.expiresIn) * 1000
    ).toISOString();

    dispatch(
      storeAuthentication(
        respData.idToken,
        respData.localId,
        respData.email,
        expirationDate
      )
    );

    await AsyncStorage.setItem(
      USER_DATA,
      JSON.stringify({
        userId: respData.localId,
        idToken: respData.idToken,
        email: respData.email,
        refreshToken: respData.refreshToken,
        expirationDate: expirationDate
      })
    );
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const requestDate = new Date();
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      let message = "Something went wrong";
      switch (errorData.error.message) {
        case "EMAIL_NOT_FOUND":
          message = "Email does not exist!";
          break;
        case "INVALID_PASSWORD":
          message = "Password is not valid!";
          break;
        case "USER_DISABLED":
          message = "Account has been disabled!";
          break;
      }
      throw new Error(message);
    }

    const respData = await response.json();
    const expirationDate = new Date(
      requestDate.getTime() + parseInt(respData.expiresIn) * 1000
    ).toISOString();

    dispatch(
      storeAuthentication(
        respData.idToken,
        respData.localId,
        respData.email,
        expirationDate
      )
    );

    await AsyncStorage.setItem(
      USER_DATA,
      JSON.stringify({
        userId: respData.localId,
        idToken: respData.idToken,
        email: respData.email,
        refreshToken: respData.refreshToken,
        expirationDate: expirationDate
      })
    );
  };
};
