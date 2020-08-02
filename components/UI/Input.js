import React, { useReducer, useEffect, useRef } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const RESET = "RESET";
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
        touched: true,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    case RESET:
      return {
        value: action.value,
        isValid: action.isValid,
        touched: false,
      };
    default:
      return state;
  }
};
const isValidURL = (str) => {
  if (!str) {
    return true;
  }
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

const Input = (props) => {
  const { onInputChange } = props;
  const inputRef = useRef(null);

  const [state, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: !!props.initiallyValid,
    touched: false,
  });

  useEffect(() => {
    if (!props.getRef) {
      return;
    }
    inputRef.current = {
      state: state,
      resetInput: resetInput,
    };
    props.getRef(inputRef);
  }, [state]);

  useEffect(() => {
    if (!props.initialValue) {
      return;
    }
    if (props.initialValue === state.value) {
      return;
    }
    resetInput();
  }, [props.initialValue]);

  useEffect(() => {
    if (state.touched) {
      props.onInputChange(props.id, state.value, state.isValid);
    }
  }, [state, onInputChange]);

  const lostFocusHandler = () => {
    dispatch({
      type: INPUT_BLUR,
    });
  };

  const resetInput = () => {
    dispatch({
      type: RESET,
      value: props.initialValue ? props.initialValue : "",
      isValid: !!props.initiallyValid,
    });
  };
  const textChangeHandler = (text) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.url && !isValidURL(text)) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && (+text > props.max || !+text)) {
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
      isValid: isValid,
    });
  };

  return (
    <View style={styles.inputControl}>
      <View
        style={{
          flexDirection: props.positionHorizontal ? "row" : "column",
          alignItems: props.positionHorizontal ? "center" : "stretch",
        }}
      >
        <Text
          style={{
            ...styles.label,
            marginVertical: props.positionHorizontal ? 0 : 5,
            marginRight: props.positionHorizontal ? 8 : 0,
          }}
        >
          {props.label}
        </Text>
        <TextInput
          {...props}
          style={styles.input}
          value={state.value}
          onChangeText={textChangeHandler}
          onBlur={lostFocusHandler}
          ref={props.childRef}
        />
      </View>
      {!state.isValid && state.touched && (
        <Text style={styles.validationText}>{props.validationText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  validationText: {
    fontFamily: "open-sans",
    fontSize: 10,
    fontStyle: "italic",
    color: "red",
  },
});

export default Input;
