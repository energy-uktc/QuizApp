import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, Button } from "react-native";
import QuizList from "./QuizList";
import Quiz from "./Quiz";
import * as quizActions from "../../store/actions/quiz";
import * as quizService from "../../service/quizService";
import { getQuizExample } from "../../data/dummyData";
import colors from "../../constants/colors";
import LoadingControl from "../../components/UI/LoadingControl";
import { QUIZ_STATUS } from "../../service/quizService";
import QuizWizard from "./wizard/QuizWizard";

export const STATE = {
  NONE: "NONE",
  TAKE_QUIZ: "TAKE_QUIZ",
  REVIEW_QUIZ: "REVIEW_QUIZ",
  CREATE_QUIZ: "CREATE_QUIZ",
};

export default HomeScreen = (props) => {
  const [quiz, setQuiz] = useState(null);
  const [screenState, setScreenState] = useState(STATE.NONE);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const passedQuizzes = useSelector((state) => state.quiz.passedQuizzes).sort(
    (q1, q2) => {
      if (q1.date < q2.date) return 1;
      if (q1.date > q2.date) return -1;
      return 0;
    }
  );
  const quizzes = useSelector((state) => state.quiz.availableQuizzes)
    .sort((q1, q2) => {
      if (q1.date < q2.date) return 1;
      if (q1.date > q2.date) return -1;
      return 0;
    })
    .map((q) => {
      if (passedQuizzes.some((p) => p.quizId === q.id)) {
        let passed = passedQuizzes.find((p) => p.quizId === q.id).passed;
        return {
          ...q,
          passed: passed,
        };
      }
      return q;
    });

  const loadQuizzes = useCallback(async () => {
    setError(null);
    try {
      await dispatch(quizActions.getQuizzes());
    } catch (err) {
      setError(err);
    }
  }, [dispatch, setIsLoading]);

  useEffect(() => {
    setIsLoading(true);
    loadQuizzes().then(() => {
      setIsLoading(false);
    });
  }, [loadQuizzes]);

  if (isLoading) {
    return <LoadingControl />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error.message}</Text>
        <Button
          title="Try again"
          onPress={loadQuizzes}
          color={colors.primary}
        />
      </View>
    );
  }

  if (quizzes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>There is no quizzes</Text>
        <Button
          title="ADD DEFAULT"
          onPress={async () => {
            try {
              const data = getQuizExample();
              const newQuiz = await quizService.insertFullQuiz(
                data.quiz,
                data.questions
              );
              dispatch(quizActions.addQuiz(newQuiz));
            } catch (e) {
              setError(e);
            }
          }}
        />
      </View>
    );
  }

  const takeQuizHandler = (quiz) => {
    setQuiz(quiz);
    setScreenState(STATE.TAKE_QUIZ);
  };
  const createQuizHandler = () => {
    console.log("createQuizHandler");
    setScreenState(STATE.CREATE_QUIZ);
  };
  const reviewQuizHandler = (quiz) => {
    quiz = passedQuizzes.find((p) => p.quizId === quiz.id);
    setScreenState(STATE.REVIEW_QUIZ);
    setQuiz(quiz);
  };
  const returnToMainScreen = () => {
    setScreenState(STATE.NONE);
    setQuiz(null);
  };

  const handleSubmitQuiz = async (quiz, questions) => {
    const newQuiz = await quizService.insertFullQuiz(quiz, questions);
    dispatch(quizActions.addQuiz(newQuiz));
    setScreenState(STATE.NONE);
    setQuiz(null);
  };
  let content = null;
  switch (screenState) {
    case STATE.NONE:
      content = (
        <QuizList
          quizzes={quizzes}
          onTakeQuiz={takeQuizHandler}
          onViewResults={reviewQuizHandler}
          onCreateQuiz={createQuizHandler}
        />
      );
      break;
    case STATE.TAKE_QUIZ:
      content = (
        <Quiz
          requestedState={QUIZ_STATUS.INIT}
          quiz={quiz}
          onGoBack={returnToMainScreen}
        />
      );
      break;
    case STATE.REVIEW_QUIZ:
      content = (
        <Quiz
          requestedState={QUIZ_STATUS.FINISHED}
          quiz={quiz}
          onGoBack={returnToMainScreen}
        />
      );
      break;
    case STATE.CREATE_QUIZ:
      content = (
        <QuizWizard
          onGoBack={returnToMainScreen}
          onSubmitQuiz={handleSubmitQuiz}
        />
      );
      break;
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
