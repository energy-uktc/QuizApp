export const GET_QUIZZES = "GET_QUIZZES";
export const ADD_QUIZ = "ADD_QUIZ";

export const getQuizzes = () => {
  return { type: GET_QUIZZES };
};

export const addQuiz = quiz => {
  return { type: ADD_QUIZ, quiz: quiz };
};
