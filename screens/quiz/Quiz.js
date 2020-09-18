import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
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
import Question from "../../components/quiz/question/Question";
import QuizResult from "./QuizResult";
import LoadingControl from "../../components/UI/LoadingControl";
import Timer from "../../components/UI/Timer";
import {
  QUIZ_STATUS,
  fetchQuestions,
  insertQuizResults,
} from "../../service/quizService";
import { addResults } from "../../store/actions/quiz";

const Quiz = (props) => {
  const dispatch = useDispatch();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [position, setPosition] = useState(0);
  const [quizStatus, setQuizStatus] = useState(QUIZ_STATUS.NONE);
  const [currQuestion, setCurrQuestion] = useState(null);
  const [startingTime, setStartingTime] = useState(Date.now());

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
    if (props.requestedState === QUIZ_STATUS.FINISHED) {
      setQuizQuestions(props.quiz.questions);
      setQuizStatus(QUIZ_STATUS.FINISHED);
    } else {
      loadQuestions().then(() => {
        setQuizStatus(QUIZ_STATUS.INIT);
      });
    }
  }, [loadQuestions, props.requestedState]);

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
    setCurrQuestion(quizQuestions[0] ?? null);
    setQuizStatus(QUIZ_STATUS.STARTED);
    setStartingTime(Date.now());
  };

  const onNextQuestionHandler = (answer) => {
    if (!quizStatus !== QUIZ_STATUS.REVIEW) {
      const updatedQuestions = quizQuestions;
      updatedQuestions[position] = currQuestion.setAnswer(answer);
      setQuizQuestions(updatedQuestions);
    }
    const newPosition = position + 1;
    setPosition(newPosition);
    setCurrQuestion(quizQuestions[newPosition] ?? null);
  };
  const onPreviousQuestionHandler = (answer) => {
    if (!quizStatus !== QUIZ_STATUS.REVIEW) {
      const updatedQuestions = quizQuestions;
      updatedQuestions[position] = currQuestion.setAnswer(answer);
      setQuizQuestions(updatedQuestions);
    }
    const newPosition = position - 1;
    setPosition(newPosition);
    setCurrQuestion(quizQuestions[newPosition] ?? null);
  };
  const onSubmitHandler = (answer) => {
    const updatedQuestions = quizQuestions;
    updatedQuestions[position] = currQuestion.setAnswer(answer);
    setQuizQuestions(updatedQuestions);
    setCurrQuestion(updatedQuestions[position]);
    setQuizStatus(QUIZ_STATUS.NONE);
    insertQuizResults(props.quiz, updatedQuestions)
      .then((newQuizResult) => {
        dispatch(addResults(newQuizResult));
        setQuizStatus(QUIZ_STATUS.FINISHED);
      })
      .catch((err) => {
        Alert.alert("Something went wrong", err.message, [
          {
            text: "OK",
            onPress: () => {
              setQuizStatus(QUIZ_STATUS.INIT);
              props.onGoBack();
            },
          },
        ]);
      });
  };

  const endQuizHandler = () => {
    setQuizStatus(QUIZ_STATUS.INIT);
    props.onGoBack();
  };

  const reviewQuestionsHandler = () => {
    setPosition(0);
    setCurrQuestion(quizQuestions[0] ?? null);
    setQuizStatus(QUIZ_STATUS.REVIEW);
  };

  const timeoutHandler = () => {
    const updatedQuestions = quizQuestions;
    setQuizStatus(QUIZ_STATUS.NONE);
    insertQuizResults(props.quiz, updatedQuestions)
      .then((newQuizResult) => {
        Alert.alert("Time is up ", "Time is up.Your result has been saved.", [
          {
            text: "OK",
            onPress: () => {
              dispatch(addResults(newQuizResult));
              setQuizStatus(QUIZ_STATUS.FINISHED);
            },
          },
        ]);
      })
      .catch((err) => {
        Alert.alert("Something went wrong", `${err.message}`, [
          {
            text: "OK",
            onPress: () => {
              setQuizStatus(QUIZ_STATUS.INIT);
              props.onGoBack();
            },
          },
        ]);
      });
  };

  const onQuestionExitHandler = () => {
    if (quizStatus === QUIZ_STATUS.REVIEW) {
      setQuizStatus(QUIZ_STATUS.FINISHED);
      return;
    }
    endQuizHandler();
  };

  console.log(`TIME MESSAGE: ${timeMessage}`);
  console.log(!!timeMessage);
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
        {!!timeMessage && (
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
    console.log(props.quiz.quizId ?? props.quiz.id);
    console.log(props.quiz.quizId);
    console.log(props.quiz.id);
    content = (
      <QuizResult
        id={props.quiz.quizId ?? props.quiz.id}
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
          {quizStatus === QUIZ_STATUS.STARTED && props.quiz.timeLimit ? (
            <Timer
              timeInSeconds={
                props.quiz.timeLimit.min * 60 + props.quiz.timeLimit.sec
              }
              startingTime={startingTime}
              onTimeout={timeoutHandler}
            />
          ) : null}
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
