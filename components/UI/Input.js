import React, { useReducer, useEffect } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

const Input = props => {
  const { onInputChange } = props;

  const [state, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false
  });

  useEffect(() => {
    if (state.touched) {
      props.onInputChange(props.id, state.value, state.isValid);
    }
  }, [state, onInputChange]);

  const lostFocusHandler = () => {
    dispatch({
      type: INPUT_BLUR
    });
  };

  const textChangeHandler = text => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (props.equal != null && text !== props.equal) {
      isValid = false;
    }

    dispatch({
      type: INPUT_CHANGE,
      value: text,
      isValid: isValid
    });
  };

  return (
    <View style={styles.inputControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={state.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
        ref={props.childRef}
      />
      {!state.isValid && state.touched && (
        <Text style={styles.validationText}>{props.validationText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputControl: {
    width: "100%"
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  validationText: {
    fontFamily: "open-sans",
    fontSize: 10,
    fontStyle: "italic",
    color: "red"
  }
});

export default Input;
