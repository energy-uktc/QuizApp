import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Dimensions } from "react-native";
import colors from "../../../constants/colors";

const OpenQuestion = (props) => {
  const [answer, setAnswer] = useState(null);
  const currQuestion = props.question;

  useEffect(() => {
    setAnswer(props.selectedAnswer);
  }, [props.selectedAnswer]);

  const changeTextHandler = (text) => {
    if (props.reviewMode) {
      return;
    }
    setAnswer(text);
  };

  let frameStyle = null;
  if (!props.reviewMode) {
    frameStyle = { borderWidth: 1, borderColor: "black" };
  } else {
    if (currQuestion.correctAnswer === (answer ?? props.selectedAnswer)) {
      frameStyle = styles.rightAnswer;
    } else {
      frameStyle = styles.wrongAnswer;
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={
          props.createMode ? "Enter correct answer" : "Enter your answer"
        }
        style={{
          ...styles.textInput,
          backgroundColor: props.reviewMode ? "#ccc" : "white",
          ...frameStyle,
        }}
        editable={!props.reviewMode}
        autoCapitalize="none"
        multiline={true}
        onChangeText={changeTextHandler}
        onBlur={() => props.onSelectAnswer(answer)}
        value={answer ?? props.selectedAnswer}
      />
      {props.reviewMode && currQuestion.correctAnswer !== answer && (
        <Text style={styles.correctAnswerText}>
          Correct Answer: {currQuestion.correctAnswer}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  textInput: {
    width: 0.9 * Dimensions.get("window").width,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: "open-sans",
  },
  rightAnswer: {
    borderWidth: 3,
    borderColor: colors.greenish,
  },
  wrongAnswer: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  correctAnswerText: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: colors.greenish,
    paddingBottom: 10,
  },
});

export default OpenQuestion;
