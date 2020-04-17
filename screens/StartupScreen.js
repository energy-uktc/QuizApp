import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import LoadingControl from "../components/UI/LoadingControl";
import { validateAuthentication, getUserData } from "../utils/authentication";
import * as authActions from "../store/actions/auth";
import * as loadingActions from "../store/actions/loading";

export default StartupScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await validateAuthentication();
        const { idToken, userId, email, expirationDate } = await getUserData();
        dispatch(
          authActions.storeAuthentication(
            idToken,
            userId,
            email,
            expirationDate
          )
        );
        dispatch(loadingActions.endLoading());
      } catch (err) {
        console.log(err.message);
        dispatch(loadingActions.endLoading());
      }
    };
    checkAuth();
  }, [validateAuthentication, dispatch]);
  return <LoadingControl />;
};
