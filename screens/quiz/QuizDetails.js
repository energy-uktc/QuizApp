import React, { useState, useCallback, useReducer } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import colors from "../../constants/colors";
import Question from "./Question";
import QuizResult from "./QuizResult";

const START_QUIZ = "START_QUIZ";
const NEXT_QUESTION = "NEXT_QUESTION";
const SUBMIT_QUIZ = "SUBMIT_QUIZ";

const quizReducer = (state, action) => {
  let userQuestions = [];
  let quizQuestions = [];
  let currQuestion = null;
  switch (action.type) {
    case START_QUIZ:
      userQuestions = [];
      quizQuestions = action.quizQuestions;
      currQuestion = quizQuestions.pop();
      return {
        ...state,
        quizQuestions: quizQuestions,
        currQuestion: currQuestion,
        userQuestions: userQuestions,
        isQuizStarted: true,
        isQuizFinished: false,
        isLastQuestion: quizQuestions.length === 0,
      };
    case NEXT_QUESTION:
      userQuestions = state.userQuestions;
      userQuestions.push(action.question);
      quizQuestions = state.quizQuestions;
      currQuestion = quizQuestions.pop();
      return {
        ...state,
        quizQuestions: quizQuestions,
        userQuestions: userQuestions,
        currQuestion: currQuestion,
        isQuizFinished: !currQuestion,
        isLastQuestion: quizQuestions.length === 0,
      };
    case SUBMIT_QUIZ: {
      userQuestions = state.userQuestions;
      userQuestions.push(action.question);
      return {
        ...state,
        userQuestions: userQuestions,
        currQuestion: null,
        isQuizFinished: true,
        isLastQuestion: false,
        isQuizStarted: false,
      };
    }
  }
  return state;
};

const QuizDetails = (props) => {
  const questions = useSelector((state) =>
    state.question.questions
      .filter((q) => q.quizId === props.quiz.id)
      .sort((q1, q2) => {
        if (q1.number < q2.number) return 1;
        if (q1.number > q2.number) return -1;
        return 0;
      })
  );

  const [quizState, dispatchQuizState] = useReducer(quizReducer, {
    quizQuestions: questions,
    currQuestion: null,
    userQuestions: [],
    isQuizStarted: false,
    isQuizFinished: false,
    isLastQuestion: false,
  });

  const dim = Dimensions.get("window");
  const timeMessage = props.quiz.timeLimit
    ? (props.quiz.timeLimit.min ? `${props.quiz.timeLimit.min} min.` : "") +
      (props.quiz.timeLimit.sec ? `${props.quiz.timeLimit.sec} sec.` : "")
    : "";

  const startQuiz = () => {
    //initializeQuestions();
    if (!quizState.quizQuestions) return;
    if (!quizState.quizQuestions.length === 0) return;
    dispatchQuizState({ type: START_QUIZ, quizQuestions: questions });
  };

  const onNextQuestionHandler = (question) => {
    dispatchQuizState({ type: NEXT_QUESTION, question: question });
  };

  const onSubmitHandler = (question) => {
    dispatchQuizState({ type: SUBMIT_QUIZ, question: question });
  };

  const endQuizHandler = () => {
    props.onGoBack();
  };

  let content = (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: props.quiz.imageUrl,
          height: dim.width / 2,
          width: dim.height / 2,
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.info}>{`${props.quiz.description}`}</Text>
        {timeMessage && (
          <Text
            style={styles.info}
          >{`You will have ${timeMessage} to pass it. You can not leave the test once started.`}</Text>
        )}
      </View>
      <View style={styles.startButton}>
        <Button color={colors.activeColor} title="START" onPress={startQuiz} />
      </View>
    </View>
  );

  if (quizState.isQuizStarted) {
    content = (
      <Question
        question={quizState.currQuestion}
        onNext={onNextQuestionHandler}
        isLast={quizState.isLastQuestion}
        onSubmit={onSubmitHandler}
      />
    );
  }
  if (quizState.isQuizFinished) {
    content = (
      <QuizResult
        userQuestions={quizState.userQuestions}
        quiz={props.quiz}
        onExit={endQuizHandler}
      />
    );
  }

  return (
    <Modal
      // style={styles.container}
      transparent={false}
      animationType={"slide"}
      onRequestClose={() => {
        if (!quizState.isQuizStarted) props.onGoBack();
      }}
      //presentationStyle={"fullScreen"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{`${props.quiz.title}`}</Text>
          </View>
          {content}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "red",
    backgroundColor: colors.backColor,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 23,
    color: colors.inactiveColor,
    padding: 15,
    textShadowColor: colors.activeColor,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  titleContainer: {
    width: "100%",
    backgroundColor: colors.primary,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  info: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: colors.activeColor,
    padding: 15,
    textAlignVertical: "center",
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    margin: 15,
    // borderWidth: 1,
    // borderColor: "blue"
  },
  startButton: {
    width: Dimensions.get("window").width / 4,
    margin: 20,
  },
});

export default QuizDetails;
