import React from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

const CustomHeaderButton = props => {
  return (
    <View style={styles.buttonContainer}>
      <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={25}
        color={
          Platform.OS === "android" ? colors.inactiveColor : colors.primary
        }
      />
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10
  },
  title: {
    fontFamily: "open-sans",
    fontSize: 10,
    color: Platform.OS === "android" ? colors.activeColor : colors.primary
  }
});
export default CustomHeaderButton;
