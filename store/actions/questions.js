import { URL } from "../../constants/api";
import {
  createQuestionFromJson,
  createJsonFromQuestion,
} from "../../service/quizService";
import { refreshTokenIfExpired } from "../../service/authentication";

export const GET_QUESTIONS = "GET_QUESTIONS";
export const ADD_QUESTION = "ADD_QUESTION";

export const getQuestions = () => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/question.json`);
    if (!response.ok) {
      console.log(`GET_QUESTIONS: Error response: ${JSON.stringify(response)}`);
      throw new Error(
        `Something went wrong. ${
          response.statusText ? response.statusText : ""
        }`
      );
    }
    const resData = await response.json();
    let loadedQuestions = [];
    for (const key in resData) {
      loadedQuestions.push(createQuestionFromJson(key, resData[key]));
    }
    dispatch({ type: GET_QUESTIONS, questions: loadedQuestions });
  };
};

export const addQuestion = (question) => {
  return async (dispatch, getState) => {
    if (!(await refreshTokenIfExpired(dispatch, getState))) return;
    const tokenId = getState().auth.idToken;
    const response = await fetch(`${URL}/question.json?auth=${tokenId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: createJsonFromQuestion(question),
    });

    if (!response.ok) {
      console.log(`ADD_QUESTION: Error response: ${JSON.stringify(response)}`);
      throw new Error(
        `Something went wrong. ${
          response.statusText ? response.statusText : ""
        }`
      );
    }
    const resData = await response.json();
    const newQuestion = createQuestionFromJson(resData.name, question);
    dispatch({ type: ADD_QUESTION, newQuestion: newQuestion });
  };
};
