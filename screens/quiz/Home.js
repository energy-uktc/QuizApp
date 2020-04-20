import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import QuizList from "./QuizList";
import Quiz from "./Quiz";
import { QUIZ_STATUS } from "../../service/quizService";

export default HomeScreen = (props) => {
  const [quiz, setQuiz] = useState(null);
  const [requestedStatus, setRequestedStatus] = useState(QUIZ_STATUS.INIT);

  const TakeQuizHandler = (quiz) => {
    setQuiz(quiz);
    setRequestedStatus(QUIZ_STATUS.INIT);
  };
  const GoBackFromQuizDetailsHandler = () => {
    setQuiz(null);
  };

  const ReviewQuizHandler = (quiz) => {
    setQuiz(quiz);
    setRequestedStatus(QUIZ_STATUS.FINISHED);
  };

  let content = (
    <QuizList onTakeQuiz={TakeQuizHandler} onViewResults={ReviewQuizHandler} />
  );
  if (quiz) {
    content = (
      <Quiz
        requestedState={requestedStatus}
        quiz={quiz}
        onGoBack={GoBackFromQuizDetailsHandler}
      />
    );
  }
  return <View style={styles.container}>{content}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
