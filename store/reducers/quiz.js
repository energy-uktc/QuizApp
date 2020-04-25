import { QUIZZES, HISTORY_QUIZZES } from "../../data/dummyData";
import { GET_QUIZZES, ADD_QUIZ, ADD_RESULTS } from "../actions/quiz";
import { Quiz, QuizResult } from "../../models/quiz";

const initialState = {
  availableQuizzes: [],
  passedQuizzes: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_QUIZZES:
      return {
        ...state,
        availableQuizzes: action.quizzes,
        passedQuizzes: action.userQuizzes,
      };
    case ADD_QUIZ:
      console.log(`ADD_QUIZ: ${action.quiz}`);
      const quiz = action.quiz;
      const newQuiz = new Quiz(
        action.id,
        quiz.title,
        quiz.imageUrl,
        quiz.description,
        quiz.timeLimit,
        quiz.date,
        quiz.minimumPointsPrc
      );
      return {
        ...state,
        availableQuizzes: state.availableQuizzes.concat(newQuiz),
      };

    case ADD_RESULTS:
      console.log(`ADD_QUIZ: ${action.quiz}`);
      const readyQuiz = action.quiz;
      const newUserQuiz = new QuizResult(
        readyQuiz.id,
        readyQuiz.title,
        readyQuiz.imageUrl,
        readyQuiz.description,
        readyQuiz.timeLimit,
        readyQuiz.date,
        readyQuiz.minimumPointsPrc,
        readyQuiz.quizId,
        readyQuiz.passed,
        readyQuiz.questions
      );
      return {
        ...state,
        passedQuizzes: state.passedQuizzes.concat(newUserQuiz),
      };
  }
  return state;
};
