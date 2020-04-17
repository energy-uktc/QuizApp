import React, { useState } from "react";
import { AppLoading } from "expo";
import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import authReducer from "./store/reducers/auth";
import quizReducer from "./store/reducers/quiz";
import loadingReducer from "./store/reducers/loading";
import questionsReducer from "./store/reducers/questions";
import * as Font from "expo-font";
import { composeWithDevTools } from "redux-devtools-extension";
import NavigationContainer from "./navigation/NavigationContainer";

const rootReducer = combineReducers({
  auth: authReducer,
  quiz: quizReducer,
  loading: loadingReducer,
  question: questionsReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk),
  composeWithDevTools()
);
const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
