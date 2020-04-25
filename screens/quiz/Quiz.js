import React, { useState, useEffect, useCallback } from "react";
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
import LoadingControl from "../../components/UI/LoadingControl";
import { QUIZ_STATUS, fetchQuestions } from "../../service/quizService";

const Quiz = (props) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [position, setPosition] = useState(0);
  const [quizStatus, setQuizStatus] = useState(QUIZ_STATUS.NONE);

  let currQuestion = null;
  if (quizQuestions) {
    currQuestion = quizQuestions[position];
  }

  useEffect(() => {
    switch (props.requestedState) {
      case QUIZ_STATUS.INIT:
        setQuizStatus(QUIZ_STATUS.INIT);
        break;
      case QUIZ_STATUS.FINISHED:
        setQuizStatus(QUIZ_STATUS.FINISHED);
        break;
      default:
        setQuizStatus(QUIZ_STATUS.INIT);
    }
  }, [props.requestedState]);

  const loadQuestions = useCallback(async () => {
    try {
      const loadedQuestions = await fetchQuestions(props.quiz.id);
      loadedQuestions.sort((q1, q2) => {
        if (q1.number < q2.number) return -1;
        if (q1.number > q2.number) return 1;
        return 0;
      });
      setQuizQuestions(loadedQuestions);
    } catch (err) {
      setQuizStatus(QUIZ_STATUS.ERROR);
    }
  }, [fetchQuestions, setQuizQuestions, setQuizStatus]);

  useEffect(() => {
    setQuizStatus(QUIZ_STATUS.NONE);
    loadQuestions().then(() => {
      setQuizStatus(QUIZ_STATUS.INIT);
    });
  }, [loadQuestions]);

  if (quizStatus == QUIZ_STATUS.NONE) {
    return <LoadingControl />;
  }

  if (quizStatus == QUIZ_STATUS.ERROR) {
    return (
      <View style={styles.centered}>
        <Text>{error.message}</Text>
        <Button
          title="Try again"
          onPress={loadQuestions}
          color={colors.primary}
        />
      </View>
    );
  }

  const dim = Dimensions.get("window");
  const timeMessage = props.quiz.timeLimit
    ? (props.quiz.timeLimit.min ? `${props.quiz.timeLimit.min} min.` : "") +
      (props.quiz.timeLimit.sec ? `${props.quiz.timeLimit.sec} sec.` : "")
    : "";

  const startQuiz = () => {
    if (!quizQuestions || quizQuestions.length === 0) {
      setQuizStatus(QUIZ_STATUS.FINISHED);
      return;
    }
    setPosition(0);
    setQuizStatus(QUIZ_STATUS.STARTED);
  };

  const onNextQuestionHandler = (answer) => {
    if (!quizStatus !== QUIZ_STATUS.REVIEW) {
      const updatedQuestions = quizQuestions;
      updatedQuestions[position] = currQuestion.setAnswer(answer);
      setQuizQuestions(updatedQuestions);
    }
    const newPosition = position + 1;
    setPosition(newPosition);
  };
  const onPreviousQuestionHandler = (answer) => {
    if (!quizStatus !== QUIZ_STATUS.REVIEW) {
      const updatedQuestions = quizQuestions;
      updatedQuestions[position] = currQuestion.setAnswer(answer);
      setQuizQuestions(updatedQuestions);
    }
    const newPosition = position - 1;
    setPosition(newPosition);
  };

  const onSubmitHandler = (answer) => {
    const updatedQuestions = quizQuestions;
    updatedQuestions[position] = currQuestion.setAnswer(answer);
    setQuizQuestions(updatedQuestions);
    setQuizStatus(QUIZ_STATUS.FINISHED);
  };

  const endQuizHandler = () => {
    setQuizStatus(QUIZ_STATUS.INIT);
    props.onGoBack();
  };

  const reviewQuestionsHandler = () => {
    setPosition(0);
    setQuizStatus(QUIZ_STATUS.REVIEW);
  };

  const onQuestionExitHandler = () => {
    if (quizStatus === QUIZ_STATUS.REVIEW) {
      setQuizStatus(QUIZ_STATUS.FINISHED);
      return;
    }
    endQuizHandler();
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

  if (quizStatus == QUIZ_STATUS.STARTED || quizStatus == QUIZ_STATUS.REVIEW) {
    content = (
      <Question
        question={currQuestion}
        isLast={quizQuestions.length === position + 1}
        isFirst={position === 0}
        reviewMode={quizStatus === QUIZ_STATUS.REVIEW}
        onNext={onNextQuestionHandler}
        onPrevious={onPreviousQuestionHandler}
        onSubmit={onSubmitHandler}
        onExit={onQuestionExitHandler}
      />
    );
  }
  if (quizStatus == QUIZ_STATUS.FINISHED) {
    content = (
      <QuizResult
        userQuestions={quizQuestions}
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
        if (quizStatus !== QUIZ_STATUS.STARTED) props.onGoBack();
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
