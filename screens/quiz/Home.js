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

export default HomeScreen = (props) => {
  const [quiz, setQuiz] = useState(null);
  const [requestedState, setRequestedState] = useState(QUIZ_STATUS.INIT);
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
    setRequestedState(QUIZ_STATUS.INIT);
  };
  const reviewQuizHandler = (quiz) => {
    quiz = passedQuizzes.find((p) => p.quizId === quiz.id);
    setQuiz(quiz);
    setRequestedState(QUIZ_STATUS.FINISHED);
  };
  const goBackFromQuizDetailsHandler = () => {
    setQuiz(null);
  };

  let content = (
    <QuizList
      quizzes={quizzes}
      onTakeQuiz={takeQuizHandler}
      onViewResults={reviewQuizHandler}
    />
  );
  if (quiz) {
    content = (
      <Quiz
        requestedState={requestedState}
        quiz={quiz}
        onGoBack={goBackFromQuizDetailsHandler}
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
