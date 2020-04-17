import { AsyncStorage, Alert } from "react-native";
import * as authActions from "../store/actions/auth";
import USER_DATA from "../constants/userData";

export const validateAuthentication = async () => {
  try {
    const {
      userId,
      idToken,
      email,
      expirationDate,
      refreshToken
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

export const isTokenExpired = expirationDate => {
  if (new Date() >= new Date(expirationDate)) {
    return true;
  }
  return false;
};

export const refreshTokenIfExpired = async (dispatch, getState) => {
  const { expirationDate } = getState().auth;
  if (!isTokenExpired(expirationDate)) {
    return true;
  }
  try {
    const { refreshToken } = await getUserData();
    await dispatch(authActions.refreshToken(refreshToken));
  } catch (err) {
    Alert.alert(`Authentication Error`, `${err.message} The App will logout`, [
      {
        text: "Okay",
        onPress: () => {
          dispatch(authActions.logout());
        }
      }
    ]);
    //dispatch(authActions.logout());
    return false;
  }
  return true;
};
