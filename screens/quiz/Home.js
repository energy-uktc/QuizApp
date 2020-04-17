import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import QuizList from "./QuizList";
import QuizDetails from "./QuizDetails";

export default HomeScreen = props => {
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [takeQuiz, setTakeQuiz] = useState(null);
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("tabPress", e => {
  //     // Prevent default behavior
  //     console.log(e);
  //     e.preventDefault();
  //     alert("Default behavior prevented");
  //     // Do something manually
  //     // ...
  //   });

  //   return unsubscribe;
  // }, [props.navigation]);
  // console.log("=========================================");
  // console.log(props.route);
  const AddQuizHandler = () => {
    setAddingQuestion(true);
  };
  const CancelAddQuizHandler = () => {
    setAddingQuestion(false);
  };

  const TakeQuizHandler = quiz => {
    setTakeQuiz(quiz);
  };
  const GoBackFromQuizDetailsHandler = () => {
    setTakeQuiz(null);
  };
  const BeginQuizHandler = quiz => {};

  let content = (
    <QuizList
      onAddQuiz={AddQuizHandler}
      onCancelAddQuiz={CancelAddQuizHandler}
      onTakeQuiz={TakeQuizHandler}
    />
  );
  if (takeQuiz) {
    content = (
      <QuizDetails
        quiz={takeQuiz}
        onBeginQuiz={BeginQuizHandler}
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
    justifyContent: "center"
  }
});
