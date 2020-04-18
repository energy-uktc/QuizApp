import { QUESTION_TYPE } from "../models/question";

export const QUIZ_STATUS = {
  NONE: 0,
  INIT: 1,
  STARTED: 2,
  FINISHED: 3,
  REVIEW: 4,
};

export const calculateQuizTotalPoints = (questions) => {
  let totalPoints = 0;
  questions.forEach((q) => {
    totalPoints += q.points;
  });
  return totalPoints;
};

export const calculateQuizEarnedPoints = (questions) => {
  let userPoints = 0;
  questions.forEach((q) => {
    if (q.userAnswer) {
      switch (q.type) {
        case QUESTION_TYPE.SINGLE_CHOICE: {
          userPoints += q.possibleAnswers[q.userAnswer].truthy ? q.points : 0;
          break;
        }
        case QUESTION_TYPE.OPEN_QUESTION: {
          userPoints += q.userAnswer === q.correctAnswer ? q.points : 0;
        }
      }
    }
  });
  return userPoints;
};
