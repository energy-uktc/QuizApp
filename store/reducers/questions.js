import { GET_QUESTIONS } from "../actions/questions";
import { QUIZ_QUESTIONS } from "../../data/dummyData";

const initialState = {
  questions: QUIZ_QUESTIONS
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_QUESTIONS:
      return {
        state
      };
  }
  return state;
};
