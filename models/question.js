export const QUESTION_TYPE = {
  OPEN_QUESTION: "OPEN_QUESTION",
  SINGLE_CHOICE: "SINGLE_CHOICE",
};

class Question {
  constructor(id, number, question, points, quizId) {
    this.id = id;
    this.number = number;
    this.question = question;
    this.points = points;
    this.quizId = quizId;
    this.type = null;
  }
}

export class OpenQuestion extends Question {
  constructor(id, number, question, points, quizId) {
    super(id, number, question, points, quizId);
    this.type = QUESTION_TYPE.OPEN_QUESTION;
  }
  setCorrectAnswer(correctAnswer) {
    this.correctAnswer = correctAnswer;
  }

  setAnswer(answer) {
    return new AnsweredOpenQuestion(this, answer);
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
        truthy: false,
      },
    };
  }

  setPossibleAnswers(possibleAnswers) {
    this.possibleAnswers = null;
    let id = 0;
    possibleAnswers.forEach((a) => {
      if (a) {
        id++;
        this.possibleAnswers = {
          ...this.possibleAnswers,
          [id]: {
            answer: a.answer,
            truthy: a.truthy,
          },
        };
      }
    });
  }

  setCorrectAnswer(correctAnswerId) {
    this.possibleAnswers[correctAnswerId].truthy = true;
  }

  setAnswer(answer) {
    return new AnsweredSingleChoiceQuestion(this, answer);
  }
}

export class AnsweredSingleChoiceQuestion extends SingleChoiceQuestion {
  constructor(question, answer) {
    super(
      question.id,
      question.number,
      question.question,
      question.points,
      question.quizId
    );
    this.possibleAnswers = question.possibleAnswers;
    this.userAnswer = answer;
  }
}

export class AnsweredOpenQuestion extends OpenQuestion {
  constructor(question, answer) {
    super(
      question.id,
      question.number,
      question.question,
      question.points,
      question.quizId
    );
    this.correctAnswer = question.correctAnswer;
    this.userAnswer = answer;
  }
}
