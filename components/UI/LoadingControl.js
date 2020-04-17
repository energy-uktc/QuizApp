import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Color from "../../constants/colors";

const LoadingControl = props => {
  return (
    <View style={{ ...styles.centered, ...props.style }}>
      <ActivityIndicator size="large" color={Color.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default LoadingControl;
