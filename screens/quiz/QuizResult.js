import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Dimensions,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as quizService from "../../service/quizService";
import * as printService from "../../service/printingService";
import FloatingPlusButton from "../../components/UI/FloatingPlusButton";

const QuizResult = (props) => {
  const dim = Dimensions.get("window");
  const quiz = useSelector((state) =>
    state.quiz.passedQuizzes.find((q) => q.quizId === props.id)
  );
  console.log(quiz);
  const [showPrint, setShowPrint] = useState(true);
  let totalPoints = quizService.calculateQuizTotalPoints(quiz.questions);
  let userPoints = quizService.calculateQuizEarnedPoints(quiz.questions);

  let score = 100;
  if (totalPoints) {
    score = Math.round((userPoints / totalPoints) * 10000, 2) / 100;
  }
  const passed = quizService.isPassed(quiz, quiz.questions);
  const printQuizHandler = () => {
    setShowPrint(false);
    printService
      .printSingleQuizResult(quiz)
      .then(() => {
        setShowPrint(true);
      })
      .catch((err) => {
        setShowPrint(true);
        console.log(err);
        //  Alert.alert("Error Printing", err);
      });
  };
  const message = passed
    ? "Congratulations! You passed the test!"
    : "Sorry ! You didn't pass the test!";
  const iconName = passed
    ? "md-checkmark-circle-outline"
    : "md-close-circle-outline";

  console.log(quiz);
  return (
    <View style={styles.screen}>
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.image}
          source={{
            uri: quiz.imageUrl,
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
        {showPrint && (
          <FloatingPlusButton
            onPress={printQuizHandler}
            iconName="ios-print"
            color={colors.activeColor}
            static
          />
        )}
      </View>
      <View>
        <Text style={styles.text}>Total Points: {totalPoints}</Text>
        <Text style={styles.text}>Your Points: {userPoints}</Text>
        <Text style={styles.text}>Score: {score}%</Text>
        <Text style={styles.text}>Target Score: {quiz.minimumPointsPrc}%</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          {quiz.questions.length > 0 && (
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
