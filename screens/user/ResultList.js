import React from "react";

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Button,
  StyleSheet,
} from "react-native";

import QuizItem from "../../components/quiz/QuizItem";

const ResultList = (props) => {
  return (
    <View style={styles.list}>
      <FlatList
        data={props.passedQuizzes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuizItem
            quiz={item}
            showTimeLimit={false}
            isTaken={true}
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
});

export default ResultList;
