import React from "react";
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
import Quiz from "../../models/quiz";

import QuizItem from "../../components/quiz/QuizItem";

const QuizList = (props) => {
  const quizzes = useSelector((state) => state.quiz.availableQuizzes).sort(
    (q1, q2) => {
      if (q1.date < q2.date) return 1;
      if (q1.date > q2.date) return -1;
      return 0;
    }
  );
  const passedQuizzes = useSelector((state) => state.quiz.passedQuizzes).sort(
    (q1, q2) => {
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
  const dispatch = useDispatch();

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
          />
        )}
      />
      {/* <Button
        title="Add Quiz"
        onPress={() => {
          const quiz = new Quiz(
            Date.now().toString(),
            "Test Quiz",
            "",
            "My test quiz",
            null,
            new Date(2019, 6, 1)
          );
          dispatch(quizActions.addQuiz(quiz));
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
  },
});

export default QuizList;
