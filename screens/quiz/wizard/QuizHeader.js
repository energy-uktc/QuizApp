import React, { useCallback, useReducer, useRef, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  Switch,
} from "react-native";
import colors from "../../../constants/colors";
import Input from "../../../components/UI/Input";

const FORM_UPDATE = "UPDATE";
const FORM_LOAD = "FORM_LOAD";
const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_UPDATE:
      const updatedInputValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedInputValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedInputValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
      }

      return {
        inputValues: updatedInputValues,
        inputValidities: updatedInputValidities,
        formIsValid: updatedFormIsValid,
      };
    case FORM_LOAD:
      const loadedState = {
        inputValues: {
          title: action.quiz.title,
          description: action.quiz.description,
          imageUrl: action.quiz.imageUrl,
          minimumPoints: action.quiz.minimumPointsPrc,
          withTimeLimit: !!action.quiz.timeLimit,
          timeLimitMinutes: !!action.quiz.timeLimit
            ? "" + action.quiz.timeLimit.min
            : 0,
          timeLimitSeconds: !!action.quiz.timeLimit
            ? "" + action.quiz.timeLimit.sec
            : 0,
        },
        inputValidities: {
          title: true,
          description: true,
          imageUrl: true,
          minimumPoints: true,
          withTimeLimit: true,
          timeLimitMinutes: true,
          timeLimitSeconds: true,
        },
        formIsValid: true,
      };
      console.log(loadedState);
      return loadedState;
    default:
      return state;
  }
};

const QuizHeader = (props) => {
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: "",
      description: "",
      imageUrl: "",
      minimumPoints: 0,
      withTimeLimit: false,
      timeLimitMinutes: 0,
      timeLimitSeconds: 0,
    },
    inputValidities: {
      title: false,
      description: false,
      imageUrl: true,
      minimumPoints: false,
      withTimeLimit: true,
      timeLimitMinutes: true,
      timeLimitSeconds: true,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputIsValid) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputIsValid,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    console.log(props.quiz);
    if (props.quiz) {
      dispatchFormState({
        type: FORM_LOAD,
        quiz: props.quiz,
      });
    }
  }, [props]);
  const timeLimitMinutesInput = useRef(null);
  const timeLimitSecondsInput = useRef(null);

  const setWithTimeLimit = (withTimeLimit) => {
    inputChangeHandler("withTimeLimit", withTimeLimit, true);
    inputChangeHandler("timeLimitMinutes", 0, !withTimeLimit);
    inputChangeHandler("timeLimitSeconds", 0, !withTimeLimit);
    if (timeLimitMinutesInput.current && !withTimeLimit) {
      timeLimitMinutesInput.current.resetInput();
    }
    if (timeLimitSecondsInput.current && !withTimeLimit) {
      timeLimitSecondsInput.current.resetInput();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Quiz wizard</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.inputContainer}>
          <Input
            id="title"
            label="Title:"
            maxLength={50}
            minLength={5}
            placeholder="Enter quiz title"
            style={styles.input}
            onInputChange={inputChangeHandler}
            validationText="Please enter valid quiz title"
            initialValue={formState.inputValues.title}
            initiallyValid={formState.inputValidities.title}
          />
          <Input
            id="description"
            label="Description:"
            placeholder="Enter quiz description"
            style={styles.input}
            onInputChange={inputChangeHandler}
            validationText="Please enter valid quiz description"
            multiline={true}
            initialValue={formState.inputValues.description}
            initiallyValid={formState.inputValidities.description}
          />
          <Input
            id="imageUrl"
            autoCapitalize={"none"}
            label="Image url:"
            placeholder="Enter image url"
            style={styles.input}
            validationText="Please enter valid image url"
            onInputChange={inputChangeHandler}
            url
            initialValue={formState.inputValues.imageUrl}
            initiallyValid={formState.inputValidities.imageUrl}
          />
          <View style={styles.rowContainer}>
            <Input
              id="minimumPoints"
              label="Minimum points (%):"
              min={0}
              validationText="Enter valid minimum points %"
              required={true}
              max={100}
              positionHorizontal={true}
              keyboardType="numeric"
              placeholder="points %"
              onInputChange={inputChangeHandler}
              validationText="Please enter valid value for minimum points %"
              style={styles.input}
              initialValue={
                formState.inputValues.minimumPoints === 0
                  ? ""
                  : "" + formState.inputValues.minimumPoints
              }
              initiallyValid={formState.inputValidities.minimumPoints}
            />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Use Time Limit:</Text>
            <Switch
              trackColor={{ false: colors.greyish, true: colors.primary }}
              thumbColor={
                formState.inputValues.withTimeLimit
                  ? colors.activeColor
                  : colors.backColor
              }
              ios_backgroundColor="#ccc"
              onValueChange={setWithTimeLimit}
              value={formState.inputValues.withTimeLimit}
            />
          </View>
          {formState.inputValues.withTimeLimit && (
            <View>
              <Input
                getRef={(ref) => (timeLimitMinutesInput.current = ref.current)}
                id="timeLimitMinutes"
                label="Minutes:"
                min={0}
                required={true}
                positionHorizontal={true}
                keyboardType="numeric"
                placeholder="min"
                onInputChange={inputChangeHandler}
                validationText="Please enter valid value"
                initialValue={formState.inputValues.timeLimitMinutes}
                initiallyValid={formState.inputValidities.timeLimitMinutes}
                style={styles.input}
              />
              <Input
                getRef={(ref) => (timeLimitSecondsInput.current = ref.current)}
                id="timeLimitSeconds"
                label="Seconds:"
                min={0}
                required={true}
                positionHorizontal={true}
                keyboardType="numeric"
                placeholder="sec"
                onInputChange={inputChangeHandler}
                validationText="Please enter valid value"
                initialValue={formState.inputValues.timeLimitSeconds}
                initiallyValid={formState.inputValidities.timeLimitSeconds}
                style={styles.input}
                style={styles.input}
              />
            </View>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>
              Total Questions: {props.questionsCount ?? 0}
            </Text>
            {formState.formIsValid && (
              <View style={styles.button}>
                <Button
                  color={colors.activeColor}
                  title="Add Question"
                  onPress={() => {
                    console.log(`ADD QUIZ: ${JSON.stringify(formState)}`);
                    props.onCreateUpdateQuizHeader({
                      title: formState.inputValues.title,
                      imageUrl: formState.inputValues.imageUrl,
                      description: formState.inputValues.description,
                      timeLimit: formState.inputValues.withTimeLimit
                        ? {
                            min: +formState.inputValues.timeLimitMinutes,
                            sec: +formState.inputValues.timeLimitSeconds,
                          }
                        : null,
                      minimumPointsPrc: formState.inputValues.minimumPoints,
                    });
                    props.onAddQuestion();
                  }}
                />
              </View>
            )}
          </View>
        </View>
        {formState.formIsValid && props.questionsCount > 1 && (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                color={colors.activeColor}
                title="Submit"
                onPress={() => {
                  props.onCreateUpdateQuizHeader({
                    title: formState.inputValues.title,
                    imageUrl: formState.inputValues.imageUrl,
                    description: formState.inputValues.description,
                    timeLimit: formState.inputValues.withTimeLimit
                      ? {
                          min: +formState.inputValues.timeLimitMinutes,
                          sec: +formState.inputValues.timeLimitSeconds,
                        }
                      : null,
                    minimumPointsPrc: formState.inputValues.minimumPoints,
                  });
                  props.onSubmit();
                }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.backColor,
  },
  bodyContainer: {
    flexGrow: 1,
    backgroundColor: colors.backColor,
    justifyContent: "space-between",
  },
  inputContainer: {
    margin: 20,
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
  text: {
    fontFamily: "open-sans",
    fontSize: 18,
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  infoLabel: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  input: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingHorizontal: 2,
    marginVertical: 10,
    paddingVertical: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    margin: 5,
    alignItems: "center",
    borderColor: colors.greyish,
    borderTopWidth: 2,
  },
  buttonContainer: {
    flexGrow: 1,
    flexDirection: "row-reverse",
    padding: 20,
    justifyContent: "center",
    width: Dimensions.get("window").width,
    alignItems: "flex-end",
    color: colors.activeColor,
  },
  button: {
    // width: Dimensions.get("window").width / 4,
  },
});

export default QuizHeader;
