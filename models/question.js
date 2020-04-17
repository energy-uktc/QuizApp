export const QUESTION_TYPE = {
  OPEN_QUESTION: "OPEN_QUESTION",
  SINGLE_CHOICE: "SINGLE_CHOICE"
};

class Question {
  constructor(id, number, question, points, quizId) {
    this.id = id;
    this.number = number;
    this.question = question;
    this.points = points;
    this.quizId = quizId;
  }
}

export class OpenQuestion extends Question {
  constructor(id, number, question, points, quizId) {
    super(id, number, question, type, points, quizId);
    this.type = QUESTION_TYPE.OPEN_QUESTION;
  }
  setCorrectAnswer(correctAnswer) {
    this.correctAnswer = correctAnswer;
  }
}

export class SingleChoiceQuestion extends Question {
  constructor(id, number, question, points, quizId) {
    super(id, number, question, points, quizId);
    this.type = QUESTION_TYPE.SINGLE_CHOICE;
  }

  addPossibleAnswer(id, answer) {
    this.possibleAnswers = {
      ...this.possibleAnswers,
      [id]: {
        answer: answer,
        truthy: false
      }
    };
  }

  setCorrectAnswer(correctAnswerId) {
    this.possibleAnswers[correctAnswerId].truthy = true;
  }
}
