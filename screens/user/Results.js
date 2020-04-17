import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import HistoryList from "../user/HistoryList";

export default ResultsScreen = props => {
  let content = <HistoryList />;
  return <View style={styles.container}>{content}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
