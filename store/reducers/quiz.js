import { QUIZZES, HISTORY_QUIZZES } from "../../data/dummyData";
import { GET_QUIZZES, ADD_QUIZ } from "../actions/quiz";
import Quiz from "../../models/quiz";

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
      };
    case ADD_QUIZ: {
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
    }
  }
  return state;
};
