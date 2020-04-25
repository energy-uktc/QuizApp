import authReducer from "./reducers/auth";
import quizReducer from "./reducers/quiz";
import loadingReducer from "./reducers/loading";
import { AUTHENTICATE } from "./actions/auth";
import * as authService from "../service/authService";
import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const saveAuthInfo = (store) => (next) => (action) => {
  if (action.type === AUTHENTICATE) {
    authService.setDispatcher(store.dispatch);
    authService.setUserId(action.userId);
  }
  return next(action);
};

const middleware = [ReduxThunk, saveAuthInfo];

const rootReducer = combineReducers({
  auth: authReducer,
  quiz: quizReducer,
  loading: loadingReducer,
});

export default store = createStore(
  rootReducer,
  //applyMiddleware(ReduxThunk),
  applyMiddleware(...middleware),
  composeWithDevTools()
);
