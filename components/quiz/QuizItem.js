import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Button,
  Image,
  Dimensions,
} from "react-native";
import Card from "../UI/Card";
import colors from "../../constants/colors";

const Touchable =
  Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

const QuizItem = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeMessage = props.quiz.timeLimit
    ? (props.quiz.timeLimit.min ? `${props.quiz.timeLimit.min} min.` : "") +
      (props.quiz.timeLimit.sec ? `${props.quiz.timeLimit.sec} sec.` : "")
    : "";

  const passedIcon = props.isTaken ? (
    props.quiz.passed ? (
      <View style={styles.mark}>
        <Ionicons
          name={"md-checkmark-circle-outline"}
          color={colors.greenish}
          size={23}
        />
      </View>
    ) : (
      <View style={styles.mark}>
        <Ionicons
          name={"md-close-circle-outline"}
          color={colors.primary}
          size={23}
        />
      </View>
    )
  ) : null;
  return (
    <View style={styles.container}>
      <Card style={styles.quizItem}>
        <View style={styles.sampleInfo}>
          <View style={styles.quizTitle}>
            <Text style={styles.title}>{props.quiz.title}</Text>

            {props.quiz.timeLimit && props.showTimeLimit && (
              <View style={styles.timeInfo}>
                <Ionicons
                  style={{ paddingRight: 10 }}
                  name={"md-stopwatch"}
                  color={colors.primary}
                  size={20}
                />
                <Text style={styles.dateField}>
                  {`You will have ${timeMessage} to pass it.`}
                </Text>
              </View>
            )}
            <Text style={styles.dateField}>
              {props.quiz.date.toDateString()}
            </Text>
          </View>
          {passedIcon}
          {!isExpanded && (
            <Touchable onPress={() => setIsExpanded(true)}>
              <View style={styles.arrowDown}>
                <Ionicons
                  name={"ios-arrow-down"}
                  color={colors.primary}
                  size={23}
                />
              </View>
            </Touchable>
          )}
        </View>
        <View>
          {isExpanded && (
            <View style={styles.details}>
              <View style={{ padding: 5 }}>
                <Image
                  style={{ width: 150, height: 150 }}
                  source={{ uri: props.quiz.imageUrl }}
                />
              </View>
              <Text style={styles.quizDescription}>
                {props.quiz.description}
              </Text>
              <View style={styles.buttonContainer}>
                {props.onTakeQuiz ? (
                  <View style={styles.button}>
                    <Button
                      style={styles.button}
                      color={colors.activeColor}
                      title={props.isTaken ? "Retry the quiz" : "Take the test"}
                      onPress={() => props.onTakeQuiz(props.quiz)}
                    />
                  </View>
                ) : null}
                {props.isTaken && props.onViewResults ? (
                  <View style={styles.button}>
                    <Button
                      color={colors.activeColor}
                      title="Your Result"
                      onPress={() => props.onViewResults(props.quiz)}
                    />
                  </View>
                ) : null}
              </View>
              <Touchable onPress={() => setIsExpanded(false)}>
                <View style={styles.arrowUp}>
                  <Ionicons
                    name={"ios-arrow-up"}
                    color={colors.primary}
                    size={23}
                  />
                </View>
              </Touchable>
            </View>
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  quizItem: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.backColor,
  },
  quizTitle: {
    flex: 15,
    borderWidth: 0,
    borderColor: "red",
  },
  mark: {
    flex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  arrowDown: {
    flex: 3,
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
  },
  arrowUp: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    width: "100%",
  },

  title: {
    fontSize: 17,

    color: colors.activeColor,
    fontFamily: "open-sans-bold",
  },
  quizDescription: {
    fontSize: 15,
    fontStyle: "italic",
    color: colors.activeColor,
    fontFamily: "open-sans",
    padding: 10,
  },
  dateField: {
    color: "#ccc",
    fontFamily: "open-sans",
  },
  timeInfo: {
    flexDirection: "row",
  },
  details: {
    alignItems: "center",
  },
  sampleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    width: Dimensions.get("window").width / 3,
    marginHorizontal: 20,
  },
});

export default QuizItem;
