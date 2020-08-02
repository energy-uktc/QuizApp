import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableNativeFeedback,
  TextInput,
  Button,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as componentUtils from "../../../components/utils";
import colors from "../../../constants/colors";
import { QUESTION_TYPE } from "../../../models/question";
const Question = (props) => {
  const [answerValue, setAnswerValue] = useState("");
  const [question, setQuestion] = useState({
    question: "",
    points: "",
    possibleAnswers: {},
    correctAnswer: "",
  });
  const [questionInputHeight, setQuestionInputHeight] = useState(30);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const QuestionBodyComponent = componentUtils.getQuestionComponentByQuestionType(
    props.type
  );
  const handleAction = (action) => {
    setAnswerValue("");
    setQuestion({
      ...question,
      question: "",
      points: "",
      possibleAnswers: {},
      correctAnswer: "",
    });
    setQuestionInputHeight(30);
    setCorrectAnswer(null);
    action();
  };

  useEffect(() => {
    if (props.question) {
      setQuestion(props.question);
      const correctAns =
        props.type === QUESTION_TYPE.OPEN_QUESTION
          ? props.question.correctAnswer
          : Object.keys(props.question.possibleAnswers).find((key) => {
              return props.question.possibleAnswers[key].truthy;
            });
      setCorrectAnswer(correctAns);
    }
  }, [props.question]);

  const isQuestionValid = (question) => {
    let isValid = true;
    isValid = isValid && question.question;
    isValid = isValid && question.points && +question.points > 0;
    if (props.type === QUESTION_TYPE.SINGLE_CHOICE) {
      isValid = isValid && Object.keys(question.possibleAnswers).length >= 2;
      isValid =
        isValid &&
        Object.keys(question.possibleAnswers).some((key) => {
          return question.possibleAnswers[key].truthy;
        });
    } else {
      isValid = isValid && question.correctAnswer;
    }

    return isValid;
  };
  const addAnswer = (answer) => {
    if (!question.question) {
      Alert.alert("Question", "Please add your question");
      return;
    }
    if (!question.points) {
      Alert.alert("Number of points", "Please add number of points");
      return;
    }
    if (!answerValue) {
      Alert.alert("Answer", "Please add possible answer");
      return;
    }
    const updatedQuestion = question;
    const ansNum = Object.keys(updatedQuestion.possibleAnswers).length + 1;
    updatedQuestion.possibleAnswers = {
      ...updatedQuestion.possibleAnswers,
      [ansNum]: {
        answer: answer,
        truthy: false,
      },
    };
    setQuestion(updatedQuestion);
    setAnswerValue("");
  };

  const setPoints = (points) => {
    if (!+points) {
      points = 0;
    }
    setQuestion({
      ...question,
      points: +points,
    });
  };
  const setQuestionText = (text) => {
    setQuestion({
      ...question,
      question: text,
    });
  };
  const updateCorrectAnswer = (value) => {
    const updatedQuestion = question;
    if (props.type === QUESTION_TYPE.SINGLE_CHOICE) {
      Object.keys(updatedQuestion.possibleAnswers).forEach((key) => {
        updatedQuestion.possibleAnswers[key].truthy = false;
      });
      updatedQuestion.possibleAnswers[value].truthy = true;
    } else {
      updatedQuestion.correctAnswer = value;
    }

    setQuestion(updatedQuestion);
    setCorrectAnswer(value);
  };

  const removeAnswer = (index) => {
    let updatedQuestion = {
      ...question,
      possibleAnswers: {},
    };
    let ansNum = 0;
    setCorrectAnswer(null);
    Object.keys(question.possibleAnswers).forEach((key) => {
      if (key != index) {
        ansNum++;
        updatedQuestion.possibleAnswers[ansNum] = question.possibleAnswers[key];
        updatedQuestion.possibleAnswers[ansNum].truthy = false;
      }
    });
    setQuestion(updatedQuestion);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Quiz wizard</Text>
        </View>
        <View style={styles.questionContainer}>
          <TextInput
            style={{ ...styles.question, height: questionInputHeight }}
            placeholder="Question..."
            multiline={true}
            onContentSizeChange={(e) =>
              setQuestionInputHeight(e.nativeEvent.contentSize.height)
            }
            onChangeText={(text) => setQuestionText(text)}
            value={question.question}
          />
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>Points:</Text>
          <TextInput
            style={styles.points}
            placeholder="points..."
            keyboardType="numeric"
            onChangeText={(text) => setPoints(text)}
            value={question.points === 0 ? "" : "" + question.points}
          />
        </View>
        <QuestionBodyComponent
          question={question}
          onSelectAnswer={updateCorrectAnswer}
          selectedAnswer={correctAnswer}
          onLongPress={removeAnswer}
          createMode
        />
        {props.type === QUESTION_TYPE.SINGLE_CHOICE && (
          <View style={styles.answerContainer}>
            <TextInput
              style={styles.answer}
              placeholder="answer..."
              onChangeText={(text) => setAnswerValue(text)}
              value={answerValue}
            />
          </View>
        )}
        {props.type === QUESTION_TYPE.SINGLE_CHOICE && (
          <TouchableNativeFeedback
            onPress={() => {
              addAnswer(answerValue);
            }}
          >
            <View style={styles.addQuestionButton}>
              <Ionicons name="md-add" size={42} color={colors.primary} />
            </View>
          </TouchableNativeFeedback>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <TouchableNativeFeedback
          onPress={() => {
            handleAction(props.onRemoveQuestion);
          }}
        >
          <View style={styles.addQuestionButton}>
            <Ionicons name="ios-trash" size={32} color={colors.primary} />
          </View>
        </TouchableNativeFeedback>
        <View style={styles.counterContainer}>
          <Text style={styles.counter}>
            {props.questionNumber}/{props.questionsCount}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {props.isLast && (
            <View style={styles.button}>
              <Button
                color={colors.activeColor}
                title="Add"
                onPress={() => {
                  if (!isQuestionValid(question)) {
                    Alert.alert("Question", "Please enter a valid question");
                  } else {
                    if (props.question) {
                      props.onUpdateQuestion({ ...question, type: props.type });
                    } else {
                      props.onCreateQuestion({ ...question, type: props.type });
                    }
                    handleAction(props.onAddQuestion);
                  }
                }}
              />
            </View>
          )}
          {!props.isLast && (
            <View style={styles.button}>
              <Button
                color={colors.activeColor}
                title=">>"
                onPress={() => {
                  if (!isQuestionValid(question)) {
                    Alert.alert("Question", "Please enter a valid question");
                  } else {
                    if (props.question) {
                      props.onUpdateQuestion({ ...question, type: props.type });
                    } else {
                      props.onCreateQuestion({ ...question, type: props.type });
                    }
                    handleAction(props.onNext);
                  }
                }}
              />
            </View>
          )}
          <View style={styles.button}>
            <Button
              color={colors.activeColor}
              title="EXIT"
              onPress={() => {
                if (!isQuestionValid(question)) {
                  Alert.alert(
                    "Question",
                    "Entered question is not valid and will be deleted if you continue. Do you want to continue?",
                    [
                      {
                        text: "Ok",
                        onPress: () => {
                          handleAction(props.onExit);
                        },
                      },
                      { text: "Cancel" },
                    ]
                  );
                } else {
                  if (props.question) {
                    props.onUpdateQuestion({ ...question, type: props.type });
                  } else {
                    props.onCreateQuestion({ ...question, type: props.type });
                  }
                  handleAction(props.onExit);
                }
              }}
            />
          </View>
          {!props.isFirst && (
            <View style={styles.button}>
              <Button
                color={colors.activeColor}
                title="<<"
                onPress={() => {
                  if (!isQuestionValid(question)) {
                    Alert.alert("Question", "Please enter a valid question");
                  } else {
                    if (props.question) {
                      props.onUpdateQuestion({ ...question, type: props.type });
                    } else {
                      props.onCreateQuestion({ ...question, type: props.type });
                    }
                    handleAction(props.onPrevious);
                  }
                }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.backColor,
    alignItems: "center",
  },
  inputContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  bottomContainer: {
    margin: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    backgroundColor: colors.primary,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 23,
    color: colors.inactiveColor,
    padding: 15,
    textShadowColor: colors.activeColor,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  question: {
    fontSize: 18,
    fontFamily: "open-sans-bold",
    borderBottomColor: colors.greyish,
    borderBottomWidth: 2,
    //marginVertical: 5,
    //textAlign: "center",
  },
  questionContainer: {
    margin: 10,
    paddingHorizontal: 20,
    //paddingVertical: 10,
    width: "100%",
  },
  pointsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: colors.greyish,
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  points: {
    fontSize: 16,

    fontFamily: "open-sans-bold",

    paddingHorizontal: 5,
  },
  counterContainer: {
    paddingVertical: 10,
  },
  counter: {
    fontFamily: "open-sans",
    fontSize: 20,
    color: colors.greyish,
  },
  answer: {
    fontSize: 16,
    fontFamily: "open-sans",
    borderBottomColor: colors.greyish,
    borderBottomWidth: 1,
    //textAlign: "center",
  },
  answerContainer: {
    //margin: 10,
    paddingHorizontal: 20,
    //paddingVertical: 10,
    width: "100%",
  },
  addQuestionButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 10,
  },

  button: {
    width: Dimensions.get("window").width / 4,
  },
});

export default Question;
