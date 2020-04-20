import {
  QUESTION_TYPE,
  SingleChoiceQuestion,
  OpenQuestion,
} from "../models/question";

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

export const createQuestionFromJson = (id, jsonData) => {
  switch (jsonData.type) {
    case QUESTION_TYPE.OPEN_QUESTION: {
      const question = new OpenQuestion(
        id,
        jsonData.number,
        jsonData.question,
        jsonData.points,
        jsonData.quizId
      );
      question.setCorrectAnswer(jsonData.correctAnswer);
      return question;
    }

    case QUESTION_TYPE.SINGLE_CHOICE: {
      const question = new SingleChoiceQuestion(
        id,
        jsonData.number,
        jsonData.question,
        jsonData.points,
        jsonData.quizId
      );
      question.setPossibleAnswers(jsonData.possibleAnswers);
      return question;
    }
  }
};

export const createJsonFromQuestion = (question) => {
  const jsonQuestion = {
    number: question.number,
    question: question.question,
    points: question.points,
    quizId: question.quizId,
    type: question.type,
  };
  switch (question.type) {
    case QUESTION_TYPE.OPEN_QUESTION: {
      return JSON.stringify({
        ...jsonQuestion,
        correctAnswer: question.correctAnswer,
      });
    }
    case QUESTION_TYPE.SINGLE_CHOICE: {
      return JSON.stringify({
        ...jsonQuestion,
        possibleAnswers: question.possibleAnswers,
      });
    }
  }
};
