import React, { useState } from "react";

import { View, FlatList, StyleSheet, Alert } from "react-native";

import QuizItem from "../../components/quiz/QuizItem";
import FloatingPlusButton from "../../components/UI/FloatingPlusButton";
import colors from "../../constants/colors";
import * as printService from "../../service/printingService";

const ResultList = (props) => {
  const [showPrint, setShowPrint] = useState(true);
  const printQuizHandler = () => {
    setShowPrint(false);
    printService
      .printUserScores(props.passedQuizzes)
      .then(() => {
        setShowPrint(true);
      })
      .catch((err) => {
        setShowPrint(true);
        Alert.alert("Error Printing", err);
      });
  };
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
      {showPrint && (
        <FloatingPlusButton
          onPress={printQuizHandler}
          iconName="ios-print"
          color={colors.accent}
        />
      )}
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
