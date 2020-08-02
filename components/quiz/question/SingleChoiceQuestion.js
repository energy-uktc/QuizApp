import React from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import colors from "../../../constants/colors";
import Card from "../../../components/UI/Card";

const SingleChoiceQuestion = (props) => {
  const selectedAnswer = props.selectedAnswer;
  const currQuestion = props.question;
  const Touchable =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
  if (!currQuestion) return null;

  return (
    <View style={styles.answers}>
      {Object.keys(currQuestion.possibleAnswers).map((val) => {
        let frameStyle = null;

        if (currQuestion.possibleAnswers[val].truthy && props.reviewMode) {
          frameStyle = styles.rightAnswer;
        }

        if (
          selectedAnswer === val &&
          !currQuestion.possibleAnswers[val].truthy &&
          props.reviewMode
        ) {
          frameStyle = styles.wrongAnswer;
        }

        return (
          <Touchable
            key={val}
            useForeground={true}
            onPress={() => {
              props.onSelectAnswer(val);
            }}
            onLongPress={() => {
              if (props.onLongPress) {
                props.onLongPress(val);
              }
            }}
          >
            <View style={styles.answerCard}>
              <Card
                style={{
                  ...{
                    backgroundColor: selectedAnswer === val ? "#ccc" : "#fff",
                  },
                  ...frameStyle,
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
  );
};

const styles = StyleSheet.create({
  answers: {
    //flex: 1,
    alignItems: "stretch",
    width: "100%",
    paddingVertical: 30,
  },
  answer: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: colors.activeColor,
  },
  answerCard: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  rightAnswer: {
    borderWidth: 3,
    borderColor: colors.greenish,
  },
  wrongAnswer: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
});
export default SingleChoiceQuestion;
