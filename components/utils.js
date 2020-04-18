import SingleChoiceQuestion from "./quiz/question/SingleChoiceQuestion";
import OpenQuestion from "./quiz/question/OpenQuestion";
import { QUESTION_TYPE } from "../models/question";

export const getQuestionComponentByQuestionType = (type) => {
  switch (type) {
    case QUESTION_TYPE.SINGLE_CHOICE: {
      return SingleChoiceQuestion;
    }
    case QUESTION_TYPE.OPEN_QUESTION: {
      return OpenQuestion;
    }
  }
};
