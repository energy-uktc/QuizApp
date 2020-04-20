import { URL } from "../../constants/api";
import Quiz from "../../models/quiz";
import { refreshTokenIfExpired } from "../../service/authentication";
export const GET_QUIZZES = "GET_QUIZZES";
export const ADD_QUIZ = "ADD_QUIZ";

export const getQuizzes = () => {
  return async (dispatch) => {
    const response = await fetch(`${URL}/quiz.json`);
    if (!response.ok) {
      console.log(`GET_QUIZZES: Error response: ${JSON.stringify(response)}`);
      throw new Error(
        `Something went wrong. ${
          response.statusText ? response.statusText : ""
        }`
      );
    }
    const resData = await response.json();
    let loadedQuizzes = [];
    for (const key in resData) {
      loadedQuizzes.push(
        new Quiz(
          key,
          resData[key].title,
          resData[key].imageUrl,
          resData[key].description,
          resData[key].timeLimit,
          new Date(resData[key].date),
          resData[key].minimumPointsPrc,
          resData[key].ownerId
        )
      );
    }
    dispatch({ type: GET_QUIZZES, quizzes: loadedQuizzes });
  };
};

export const addQuiz = (quiz) => {
  return async (dispatch, getState) => {
    if (!(await refreshTokenIfExpired(dispatch, getState))) return;
    const tokenId = getState().auth.idToken;
    console.log(`TokenId: ${tokenId}`);
    const userId = getState().auth.userId;
    console.log(`userId: ${userId}`);
    const response = await fetch(`${URL}/quiz.json?auth=${tokenId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: quiz.title,
        imageUrl: quiz.imageUrl,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        date: quiz.date,
        minimumPointsPrc: quiz.minimumPointsPrc,
        ownerId: userId,
      }),
    });
    if (!response.ok) {
      console.log(`ADD_QUIZ: Error response: ${JSON.stringify(response)}`);
      throw new Error(
        `Something went wrong. ${
          response.statusText ? response.statusText : ""
        }`
      );
    }
    const resData = await response.json();
    dispatch({
      type: ADD_QUIZ,
      quiz: {
        title: quiz.title,
        imageUrl: quiz.imageUrl,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        date: quiz.date,
        minimumPointsPrc: quiz.minimumPointsPrc,
        ownerId: userId,
      },
      id: resData.name,
    });
  };
};
