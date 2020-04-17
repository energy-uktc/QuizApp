import React, { useState, useCallback, useReducer } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Alert,
  Platform
} from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import LoadingControl from "../../components/UI/LoadingControl";
import colors from "../../constants/colors";

const FORM_UPDATE = "UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedInputValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
    }

    return {
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formIsValid: updatedFormIsValid
    };
  } else {
    return state;
  }
};

const AuthScreen = props => {
  const dispatch = useDispatch();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    inputValidities: {
      email: false,
      password: false,
      confirmPassword: !isSignup
    },
    formIsValid: false
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputIsValid) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputIsValid,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const authHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Validation Error",
        "Please enter valid authentication information!",
        [{ text: "OK" }]
      );
      return;
    }
    try {
      setIsLoading(true);
      if (isSignup) {
        await dispatch(
          authActions.signup(
            formState.inputValues.email,
            formState.inputValues.password
          )
        );
      } else {
        await dispatch(
          authActions.login(
            formState.inputValues.email,
            formState.inputValues.password
          )
        );
      }
    } catch (err) {
      setIsLoading(false);
      Alert.alert(`Error ${isSignup ? "sing up" : "login"}`, `${err}`, [
        { text: "OK" }
      ]);
    }
  }, [dispatch, isSignup, formState]);

  // if (isLoading) {
  //   return <LoadingControl />;
  // }
  let passwordInput = null;

  return (

    <LinearGradient
      style={styles.screen}
      //colors={["#D9C9D0", "#D4C7CD", "#EAD1DC"]}
      colors={[colors.backColor, colors.backColor, colors.backColor]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
      >
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              onSubmitEditing={() => {
                passwordInput.focus();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Please enter valid email"
              label="E-Mail"
              onInputChange={inputChangeHandler}
              required={true}
              email
            />
            <Input
              id="password"
              childRef={ref => {
                passwordInput = ref;
              }}
              onSubmitEditing={() => { }}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Please enter valid password"
              label="Password"
              onInputChange={inputChangeHandler}
              required={true}
              minLength={5}
            />
            {isSignup && (
              <Input
                id="confirmPassword"
                childRef={ref => {
                  passwordInput = ref;
                }}
                onSubmitEditing={() => { }}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                validationText="Please enter valid password"
                label="Confirm Password"
                onInputChange={inputChangeHandler}
                required={true}
                minLength={5}
                equal={formState.inputValues.password}
              />
            )}
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <LoadingControl />
              ) : (
                  <Button
                    title={isSignup ? "Sign Up" : "Login"}
                    color={colors.primary}
                    onPress={authHandler}
                  />
                )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                color={colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                  if (!isSignup) {
                    dispatchFormState({
                      type: FORM_UPDATE,
                      value: "",
                      isValid: false,
                      input: "confirmPassword"
                    });
                  } else {
                    dispatchFormState({
                      type: FORM_UPDATE,
                      value: "",
                      isValid: true,
                      input: "confirmPassword"
                    });
                  }
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </KeyboardAvoidingView>
    </LinearGradient>

  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default AuthScreen;
