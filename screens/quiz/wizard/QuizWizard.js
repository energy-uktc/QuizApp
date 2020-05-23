import React from "react";
import { View, Text, Button, Modal, StyleSheet } from "react-native";

const QuizWizard = (props) => {
  return (
    <Modal
      transparent={false}
      animationType={"slide"}
      onRequestClose={() => {
        props.onGoBack();
      }}
    >
      <View>
        <Text>Quiz wizard</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
export default QuizWizard;
