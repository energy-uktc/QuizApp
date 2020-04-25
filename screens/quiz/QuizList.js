import React from "react";

import { View, Text, FlatList, StyleSheet } from "react-native";

import QuizItem from "../../components/quiz/QuizItem";

const QuizList = (props) => {
  return (
    <View style={styles.list}>
      <FlatList
        data={props.quizzes}
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
