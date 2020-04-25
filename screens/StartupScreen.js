import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import LoadingControl from "../components/UI/LoadingControl";
import { validateAuthentication, getUserData } from "../service/authService";
import * as authActions from "../store/actions/auth";
import * as loadingActions from "../store/actions/loading";

export default StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await validateAuthentication();
        const { userId } = await getUserData();
        dispatch(authActions.storeAuthentication(userId));
        dispatch(loadingActions.endLoading());
      } catch (err) {
        console.log(err.message);
        dispatch(authActions.logout());
        dispatch(loadingActions.endLoading());
      }
    };
    checkAuth();
  }, [validateAuthentication, dispatch]);
  return <LoadingControl />;
};
