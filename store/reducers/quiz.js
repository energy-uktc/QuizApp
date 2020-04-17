import { QUIZZES, HISTORY_QUIZZES } from "../../data/dummyData";
import { GET_QUIZZES, ADD_QUIZ } from "../actions/quiz";

const initialState = {
  availableQuizzes: QUIZZES,
  passedQuizzes: HISTORY_QUIZZES
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_QUIZZES:
      return {
        state
      };
    case ADD_QUIZ: {
      const updatedAvailableQuizzes = state.availableQuizzes.concat(
        action.quiz
      );
      return {
        ...state,
        availableQuizzes: updatedAvailableQuizzes
      };
    }
  }
  return state;
};
