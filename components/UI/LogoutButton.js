import React from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import HeaderButton from "./HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const LogoutButton = props => {
  const dispatch = useDispatch();

  return (
    <HeaderButtons HeaderButtonComponent={HeaderButton} left={true}>
      <Item
        title="Log Out"
        iconName={Platform.OS === "android" ? "md-exit" : "ios-exit"}
        onPress={() => {
          Alert.alert("Log out", "Do you want to log out?", [
            {
              text: "Yes",
              onPress: () => {
                dispatch(authActions.logout());
              }
            },
            {
              text: "No"
            }
          ]);
        }}
      />
    </HeaderButtons>
  );
};

export default LogoutButton;
