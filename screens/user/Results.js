import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, Button } from "react-native";
import ResultList from "../user/ResultList";
import Quiz from "../quiz/Quiz";
import { QUIZ_STATUS } from "../../service/quizService";
import LoadingControl from "../../components/UI/LoadingControl";
import * as quizActions from "../../store/actions/quiz";

export default ResultsScreen = (props) => {
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const passedQuizzes = useSelector((state) => state.quiz.passedQuizzes).sort(
    (q1, q2) => {
      if (q1.date < q2.date) return 1;
      if (q1.date > q2.date) return -1;
      return 0;
    }
  );
  const dispatch = useDispatch();
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

  const reviewQuizHandler = (quiz) => {
    setQuiz(quiz);
  };

  const goBackFromQuizDetailsHandler = () => {
    setQuiz(null);
  };

  let content = (
    <ResultList
      onViewResults={reviewQuizHandler}
      passedQuizzes={passedQuizzes}
    />
  );
  if (quiz) {
    content = (
      <Quiz
        requestedState={QUIZ_STATUS.FINISHED}
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
