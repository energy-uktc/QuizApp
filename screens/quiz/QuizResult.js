import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Dimensions,
} from "react-native";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as quizService from "../../service/quizService";

const QuizResult = (props) => {
  const dim = Dimensions.get("window");
  let totalPoints = quizService.calculateQuizTotalPoints(props.userQuestions);
  let userPoints = quizService.calculateQuizEarnedPoints(props.userQuestions);
  const minimumPoints = (props.quiz.minimumPointsPrc / 100) * totalPoints;
  let score = 100;
  if (totalPoints) {
    score = Math.round((userPoints / totalPoints) * 10000, 2) / 100;
  }
  const passed = !props.quiz.minimumPointsPrc || minimumPoints <= userPoints;
  const message = passed
    ? "Congratulations! You passed the test!"
    : "Sorry ! You didn't pass the test!";
  const iconName = passed
    ? "md-checkmark-circle-outline"
    : "md-close-circle-outline";
  return (
    <View style={styles.screen}>
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.image}
          source={{
            uri: props.quiz.imageUrl,
            height: dim.width / 2,
            width: dim.height / 2,
          }}
        />
        <Text style={passed ? styles.successText : styles.failedText}>
          {message}
        </Text>
        <Text style={passed ? styles.successText : styles.failedText}>
          {score}%
        </Text>
        <Ionicons
          name={iconName}
          color={passed ? colors.greenish : colors.primary}
          size={50}
        />
      </View>
      <View>
        <Text style={styles.text}>Total Points: {totalPoints}</Text>
        <Text style={styles.text}>Your Points: {userPoints}</Text>
        <Text style={styles.text}>Score: {score}%</Text>
        <Text style={styles.text}>
          Target Score: {props.quiz.minimumPointsPrc}%
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          {props.userQuestions.length > 0 && (
            <Button
              title="Review Answers"
              color={colors.activeColor}
              onPress={props.onReview}
            />
          )}
        </View>
        <View style={styles.button}>
          <Button
            title="Exit"
            color={colors.activeColor}
            onPress={props.onExit}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  image: {
    resizeMode: "contain",
    margin: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    width: Dimensions.get("window").width,
  },
  button: {
    width: Dimensions.get("window").width / 3,
  },
  text: {
    padding: 5,
    fontSize: 17,
    fontFamily: "open-sans-bold",
    color: colors.activeColor,
  },
  successText: {
    padding: 5,
    fontSize: 19,
    fontFamily: "open-sans-bold",
    color: colors.greenish,
  },
  failedText: {
    padding: 5,
    fontSize: 19,
    fontFamily: "open-sans-bold",
    color: colors.primary,
  },
});

export default QuizResult;
