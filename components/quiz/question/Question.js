import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import colors from "../../../constants/colors";
import * as componentUtils from "../../utils";

const Question = (props) => {
  let userQuestion = props.question;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currQuestion = props.question;
  const QuestionBodyComponent = componentUtils.getQuestionComponentByQuestionType(
    currQuestion.type
  );

  useEffect(() => {
    if (userQuestion.userAnswer) {
      console.log(
        `useEffect.CurrQuestion: ${userQuestion.number} UserAnswer: ${userQuestion.userAnswer}`
      );
      setSelectedAnswer(userQuestion.userAnswer);
    }
    setIsLoading(false);
  }, [userQuestion]);

  const selectAnswer = (ans) => {
    if (props.reviewMode) {
      return;
    }
    setSelectedAnswer(ans);
  };
  const finalize = () => {
    setIsLoading(true);
    if (props.reviewMode) {
      return;
    }
    userQuestion = {
      ...currQuestion,
      userAnswer: selectedAnswer,
    };
    setSelectedAnswer(null);
  };

  if (isLoading) {
    return null;
  }

  const actionButton = (
    <View style={styles.actionButton}>
      {!props.isLast && (
        <View style={styles.button}>
          <Button
            color={colors.activeColor}
            title="NEXT"
            onPress={() => {
              finalize();
              props.onNext(userQuestion);
            }}
          />
        </View>
      )}
      {props.isLast && !props.reviewMode && (
        <View style={styles.button}>
          <Button
            color={colors.activeColor}
            title="SUBMIT"
            onPress={() => {
              finalize();
              props.onSubmit(userQuestion);
            }}
          />
        </View>
      )}
      {props.reviewMode && (
        <View style={styles.button}>
          <Button
            color={colors.activeColor}
            title="EXIT"
            onPress={props.onExit}
          />
        </View>
      )}
      {!props.isFirst && (
        <View style={styles.button}>
          <Button
            color={colors.activeColor}
            title="PREVIOUS"
            onPress={() => {
              finalize();
              props.onPrevious(userQuestion);
            }}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {currQuestion.number}.{currQuestion.question}
      </Text>
      <QuestionBodyComponent
        {...props}
        onSelectAnswer={selectAnswer}
        selectedAnswer={selectedAnswer}
      />
      {props.reviewMode && (
        <Text style={styles.pointsText}>Points : {currQuestion.points}</Text>
      )}
      {actionButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.backColor,
  },
  question: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    fontStyle: "italic",
    color: colors.activeColor,
  },
  answers: {
    flex: 1,
    alignItems: "stretch",
    width: "100%",
    paddingVertical: 30,
  },
  answer: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: colors.activeColor,
  },
  answerCard: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row-reverse",
    padding: 20,
    justifyContent: "space-between",
    width: Dimensions.get("window").width,
    alignItems: "flex-end",
    color: colors.activeColor,
  },
  button: {
    width: Dimensions.get("window").width / 4,
  },
  rightAnswer: {
    borderWidth: 3,
    borderColor: colors.greenish,
  },
  wrongAnswer: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  pointsText: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: colors.activeColor,
  },
});
export default Question;
