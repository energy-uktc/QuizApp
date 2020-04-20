import { GET_QUESTIONS, ADD_QUESTION } from "../actions/questions";

const initialState = {
  questions: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_QUESTIONS:
      return {
        ...state,
        questions: action.questions,
      };
    case ADD_QUESTION:
      return {
        ...state,
        question: state.questions.concat(action.newQuestion),
      };
  }
  return state;
};
