import React from "react";
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
const FloatingPlusButton = (props) => {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: props.color ?? colors.primary,
      }}
    >
      <TouchableNativeFeedback
        onPress={() => {
          if (props.onPress) {
            props.onPress();
          }
        }}
      >
        <Ionicons name="ios-add" size={35} color="white" />
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    right: Dimensions.get("window").width * 0.02,
    bottom: Dimensions.get("window").height * 0.01,
    overflow: "hidden",
    backgroundColor: colors.primary,
  },
});

export default FloatingPlusButton;
