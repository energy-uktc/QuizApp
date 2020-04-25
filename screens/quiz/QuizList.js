import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Button,
  StyleSheet,
} from "react-native";
import * as quizActions from "../../store/actions/quiz";
import * as quizService from "../../service/quizService";
import { getQuizExample } from "../../data/dummyData";

import LoadingControl from "../../components/UI/LoadingControl";
import QuizItem from "../../components/quiz/QuizItem";

const QuizList = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const quizzes = useSelector((state) => state.quiz.availableQuizzes).sort(
    (q1, q2) => {
      console.log(sorting);
      if (q1.date < q2.date) return 1;
      if (q1.date > q2.date) return -1;
      return 0;
    }
  );
  const passedQuizzes = useSelector((state) => state.quiz.passedQuizzes).sort(
    (q1, q2) => {
      console.log(sorting);
      if (q1.date < q2.date) return 1;
      if (q1.date > q2.date) return -1;
      return 0;
    }
  );

  const showQuizzes = quizzes.map((q) => {
    let pq = passedQuizzes.find((pq) => pq.id === q.id);
    if (pq) {
      q.passed = pq.passed;
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

  if (!isLoading && quizzes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>There is no quizzes</Text>
        <Button
          title="ADD DEFAULT"
          onPress={async () => {
            try {
              const data = getQuizExample();
              console.log(data.questions);
              await quizService.insertFullQuiz(data.quiz, data.questions);
              await loadQuizzes();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </View>
    );
  }

  if (!isLoading && error) {
    return (
      <View style={styles.centered}>
        <Text>{error.message}</Text>
        <Button title="Try again" onPress={loadQuizzes} color={Color.primary} />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <FlatList
        data={showQuizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuizItem
            quiz={item}
            showTimeLimit={true}
            isTaken={(item.passed ?? null) === null ? false : true}
            onTakeQuiz={props.onTakeQuiz}
            onViewResults={props.onViewResults}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QuizList;
