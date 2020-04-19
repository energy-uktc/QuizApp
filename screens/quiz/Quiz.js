import React, { useEffect, useReducer } from "react";
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
} from "react-native";
import colors from "../../constants/colors";
import Question from "../../components/quiz/question/Question";
import QuizResult from "./QuizResult";
import { QUIZ_STATUS } from "../../utils/quizUtils";

const INIT = "INIT";
const VIEW_RESULTS = "VIEW_RESULTS";
const START_QUIZ = "START_QUIZ";
const NEXT_QUESTION = "NEXT_QUESTION";
const PREVIOUS_QUESTION = "PREVIOUS_QUESTION";
const SUBMIT_QUIZ = "SUBMIT_QUIZ";
const REVIEW_QUIZ = "REVIEW_QUIZ";
const FINALIZE = "FINALIZE";

const quizReducer = (state, action) => {
  let position = state.position;
  let quizQuestions = state.quizQuestions;
  let currQuestion = null;
  switch (action.type) {
    case INIT:
      return {
        ...state,
        quizStatus: QUIZ_STATUS.INIT,
      };
    case START_QUIZ:
      currQuestion = quizQuestions[position];
      return {
        ...state,
        currQuestion: currQuestion,
        position: 0,
        quizStatus: QUIZ_STATUS.STARTED,
      };
    case NEXT_QUESTION:
      quizQuestions[position] = action.question;
      position++;
      currQuestion = quizQuestions[position];
      return {
        ...state,
        quizQuestions: quizQuestions,
        position: position,
        currQuestion: currQuestion,
      };
    case PREVIOUS_QUESTION:
      quizQuestions[position] = action.question;
      position--;
      currQuestion = quizQuestions[position];
      return {
        ...state,
        quizQuestions: quizQuestions,
        position: position,
        currQuestion: currQuestion,
      };
    case SUBMIT_QUIZ: {
      quizQuestions[position] = action.question;
      return {
        ...state,
        quizQuestions: quizQuestions,
        quizStatus: QUIZ_STATUS.FINISHED,
      };
    }
    case VIEW_RESULTS: {
      return {
        ...state,
        quizStatus: QUIZ_STATUS.FINISHED,
      };
    }
    case REVIEW_QUIZ: {
      position = 0;
      currQuestion = quizQuestions[position];
      return {
        ...state,
        position: 0,
        currQuestion: currQuestion,
        quizStatus: QUIZ_STATUS.REVIEW,
      };
    }
    case FINALIZE: {
      return {
        ...state,
        quizStatus: QUIZ_STATUS.INIT,
      };
    }
  }
  return state;
};

const Quiz = (props) => {
  const questions = useSelector((state) => {
    console.log(props.quiz);
    return state.question.questions
      .filter((q) => q.quizId === props.quiz.id)
      .sort((q1, q2) => {
        if (q1.number < q2.number) return -1;
        if (q1.number > q2.number) return 1;
        return 0;
      });
  });

  const [quizState, dispatchQuizState] = useReducer(quizReducer, {
    quizQuestions: questions,
    currQuestion: null,
    position: 0,
    quizStatus: QUIZ_STATUS.NONE,
  });

  useEffect(() => {
    switch (props.requestedState) {
      case QUIZ_STATUS.INIT:
        dispatchQuizState({ type: INIT });
        break;
      case QUIZ_STATUS.FINISHED:
        dispatchQuizState({ type: VIEW_RESULTS });
        break;
      default:
        dispatchQuizState({ type: INIT });
    }
  }, [props.requestedState]);

  const dim = Dimensions.get("window");
  const timeMessage = props.quiz.timeLimit
    ? (props.quiz.timeLimit.min ? `${props.quiz.timeLimit.min} min.` : "") +
      (props.quiz.timeLimit.sec ? `${props.quiz.timeLimit.sec} sec.` : "")
    : "";

  const startQuiz = () => {
    //initializeQuestions();
    if (!quizState.quizQuestions) return;
    if (!quizState.quizQuestions.length === 0) return;
    dispatchQuizState({ type: START_QUIZ });
  };

  const onNextQuestionHandler = (question) => {
    dispatchQuizState({ type: NEXT_QUESTION, question: question });
  };
  const onPreviousQuestionHandler = (question) => {
    dispatchQuizState({ type: PREVIOUS_QUESTION, question: question });
  };

  const onSubmitHandler = (question) => {
    dispatchQuizState({ type: SUBMIT_QUIZ, question: question });
  };

  const endQuizHandler = () => {
    dispatchQuizState({ type: FINALIZE });
    props.onGoBack();
  };

  const reviewQuestionsHandler = () => {
    dispatchQuizState({ type: REVIEW_QUIZ });
  };

  const onQuestionExitHandler = () => {
    if (quizState.quizStatus === QUIZ_STATUS.REVIEW) {
      dispatchQuizState({ type: VIEW_RESULTS });
      return;
    }
    endQuizHandler();
  };

  if (quizState.quizStatus === QUIZ_STATUS.NONE) {
    return null;
  }

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

  if (
    quizState.quizStatus == QUIZ_STATUS.STARTED ||
    quizState.quizStatus == QUIZ_STATUS.REVIEW
  ) {
    content = (
      <Question
        question={quizState.currQuestion}
        isLast={quizState.quizQuestions.length === quizState.position + 1}
        isFirst={quizState.position === 0}
        reviewMode={quizState.quizStatus === QUIZ_STATUS.REVIEW}
        onNext={onNextQuestionHandler}
        onPrevious={onPreviousQuestionHandler}
        onSubmit={onSubmitHandler}
        onExit={onQuestionExitHandler}
      />
    );
  }
  if (quizState.quizStatus == QUIZ_STATUS.FINISHED) {
    content = (
      <QuizResult
        userQuestions={quizState.quizQuestions}
        quiz={props.quiz}
        onExit={endQuizHandler}
        onReview={reviewQuestionsHandler}
      />
    );
  }

  return (
    <Modal
      transparent={false}
      animationType={"slide"}
      onRequestClose={() => {
        if (!quizState.isQuizStarted) props.onGoBack();
      }}
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
  },
  startButton: {
    width: Dimensions.get("window").width / 4,
    margin: 20,
  },
});

export default Quiz;
