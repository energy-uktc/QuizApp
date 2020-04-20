import { AsyncStorage, Alert } from "react-native";
import * as authActions from "../store/actions/auth";
import USER_DATA from "../constants/userData";
import { REFRESH_TOKEN_URL, API_KEY } from "../constants/api";
export const validateAuthentication = async () => {
  try {
    const {
      userId,
      idToken,
      email,
      expirationDate,
      refreshToken,
    } = await getUserData();

    if (!userId || !idToken || !refreshToken || !email || !expirationDate) {
      throw new Error("User information not found");
    }
  } catch (err) {
    throw new Error(`Could not authenticate.${err.message}`);
  }
};

export const getUserData = async () => {
  const userDataString = await AsyncStorage.getItem(USER_DATA);
  if (!userDataString) {
    throw new Error("User information not found");
  }

  const userData = JSON.parse(userDataString);
  if (!userData) {
    throw new Error("User information not found");
  }
  return userData;
};

export const isTokenExpired = (expirationDate) => {
  if (new Date() >= new Date(expirationDate)) {
    return true;
  }
  return false;
};

export const refreshTokenIfExpired = async (dispatch) => {
  try {
    const { expirationDate, refreshToken } = await getUserData();
    if (!isTokenExpired(expirationDate)) {
      return true;
    }

    await refreshToken(refreshToken);
  } catch (err) {
    Alert.alert(`Authentication Error`, `${err.message} The App will logout`, [
      {
        text: "Okay",
        onPress: () => {
          dispatch(authActions.logout());
        },
      },
    ]);
    return false;
  }
  return true;
};

export const refreshToken = async (refreshToken) => {
  const requestDate = new Date();
  const response = await fetch(`${REFRESH_TOKEN_URL}/token?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

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
        message = "The user corresponding to the refresh token was not found.";
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

  await AsyncStorage.mergeItem(
    USER_DATA,
    JSON.stringify({
      idToken: respData.id_token,
      refreshToken: respData.refresh_token,
      expirationDate: expirationDate,
    })
  );
};
