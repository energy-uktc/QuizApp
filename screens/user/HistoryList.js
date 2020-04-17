import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Button,
  StyleSheet
} from "react-native";
import * as quizActions from "../../store/actions/quiz";
import Quiz from "../../models/quiz";

import QuizItem from "../../components/quiz/QuizItem";

const HistoryList = props => {
  const passedQuizzes = useSelector(state => state.quiz.passedQuizzes).sort(
    (q1, q2) => {
      if (q1.date < q2.date) return 1;
      if (q1.date > q2.date) return -1;
      return 0;
    }
  );
  const dispatch = useDispatch();

  return (
    <View style={styles.list}>
      <FlatList
        data={passedQuizzes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <QuizItem quiz={item} showTimeLimit={false} isTaken={true} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%"
  }
});

export default HistoryList;
