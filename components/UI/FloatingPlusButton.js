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
      style={
        props.static
          ? {
              ...styles.containerStatic,
              backgroundColor: props.color ?? colors.primary,
            }
          : {
              ...styles.containerFloat,
              backgroundColor: props.color ?? colors.primary,
            }
      }
    >
      <TouchableNativeFeedback
        onPress={() => {
          if (props.onPress) {
            props.onPress();
          }
        }}
      >
        <Ionicons name={props.iconName} size={35} color="white" />
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFloat: {
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
  containerStatic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
});

export default FloatingPlusButton;
