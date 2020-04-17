import React, { useState } from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  Button,
  StyleSheet,
  Dimensions
} from "react-native";
import colors from "../../constants/colors";
import Card from "../../components/UI/Card";

const Question = props => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const currQuestion = props.question;

  const Touchable =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

  const actionButton = props.isLast ? (
    <View style={styles.actionButton}>
      <Button
        color={colors.activeColor}
        title="SUBMIT"
        onPress={() => {
          let userAnswer = {
            ...currQuestion,
            userAnswer: selectedAnswer
          };
          setSelectedAnswer(null);
          props.onSubmit(userAnswer);
        }}
      />
    </View>
  ) : (
    <View style={styles.actionButton}>
      <Button
        color={colors.activeColor}
        title="NEXT"
        onPress={() => {
          let userAnswer = {
            ...currQuestion,
            userAnswer: selectedAnswer
          };
          setSelectedAnswer(null);
          props.onNext(userAnswer);
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {currQuestion.number}.{currQuestion.question}
      </Text>
      <View style={styles.answers}>
        {Object.keys(currQuestion.possibleAnswers).map(val => {
          return (
            <Touchable
              useForeground={true}
              onPress={() => {
                //alert(selectedAnswer);
                setSelectedAnswer(val);
              }}
            >
              <View style={styles.answerCard}>
                <Card
                  style={{
                    backgroundColor: selectedAnswer === val ? "green" : "#fff"
                  }}
                >
                  <Text style={styles.answer} key={val}>
                    {val}.{currQuestion.possibleAnswers[val].answer}
                  </Text>
                </Card>
              </View>
            </Touchable>
          );
        })}
      </View>
      {actionButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.backColor
  },
  question: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    fontStyle: "italic",
    color: colors.activeColor
  },
  answers: {
    flex: 1,
    alignItems: "stretch",
    width: "100%",
    paddingVertical: 30
    // borderWidth: 1,
    // borderColor: "red"
  },
  answer: {
    fontFamily: "open-sans",
    fontSize: 16,
    //fontStyle: "italic",
    color: colors.activeColor
  },
  answerCard: {
    // borderWidth: 1,
    // borderColor: "red",
    //width: Dimensions.get("window").width - 10,
    margin: 10,
    //padding: 20
    borderRadius: 10,
    //borderTopRightRadius: 10,
    overflow: "hidden"
  },
  actionButton: {
    color: colors.activeColor,
    width: Dimensions.get("window").width / 4
  }
});
export default Question;
