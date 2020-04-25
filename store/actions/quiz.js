import * as quizService from "../../service/quizService";
export const GET_QUIZZES = "GET_QUIZZES";
export const ADD_QUIZ = "ADD_QUIZ";
export const ADD_RESULTS = "ADD_RESULTS";

export const getQuizzes = () => {
  return async (dispatch) => {
    const loadedQuizzes = await quizService.fetchQuizzes();
    const loadedUserQuizzes = await quizService.fetchUserQuizzes();
    dispatch({
      type: GET_QUIZZES,
      quizzes: loadedQuizzes,
      userQuizzes: loadedUserQuizzes,
    });
  };
};

export const addQuiz = (quiz) => {
  return {
    type: ADD_QUIZ,
    quiz: {
      title: quiz.title,
      imageUrl: quiz.imageUrl,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      date: quiz.date,
      minimumPointsPrc: quiz.minimumPointsPrc,
      ownerId: quiz.ownerId,
    },
    id: quiz.id,
  };
};

export const addResults = (passedQuiz) => {
  return { type: ADD_RESULTS, quiz: passedQuiz };
};
