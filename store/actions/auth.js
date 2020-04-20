import { AsyncStorage } from "react-native";
import USER_DATA from "../../constants/userData";
import { API_KEY, AUTH_URL } from "../../constants/api";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const storeAuthentication = (userId) => {
  return {
    type: AUTHENTICATE,
    userId: userId,
  };
};

export const logout = () => {
  return async (dispatch) => {
    await AsyncStorage.removeItem(USER_DATA);
    dispatch({ type: LOGOUT });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const requestDate = new Date();

    const response = await fetch(`${AUTH_URL}/accounts:signUp?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    });

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

    dispatch(storeAuthentication(respData.localId));

    await AsyncStorage.setItem(
      USER_DATA,
      JSON.stringify({
        userId: respData.localId,
        idToken: respData.idToken,
        email: respData.email,
        refreshToken: respData.refreshToken,
        expirationDate: expirationDate,
      })
    );
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const requestDate = new Date();
    const response = await fetch(
      `${AUTH_URL}/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
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

    dispatch(storeAuthentication(respData.localId));

    await AsyncStorage.setItem(
      USER_DATA,
      JSON.stringify({
        userId: respData.localId,
        idToken: respData.idToken,
        email: respData.email,
        refreshToken: respData.refreshToken,
        expirationDate: expirationDate,
      })
    );
  };
};
