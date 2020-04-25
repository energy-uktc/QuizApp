export class Quiz {
  constructor(
    id,
    title,
    imageUrl,
    description,
    timeLimit,
    date,
    minimumPointsPrc,
    ownerId
  ) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.date = date;
    this.timeLimit = timeLimit;
    this.minimumPointsPrc = minimumPointsPrc;
    this.ownerId = ownerId;
  }
}

export class QuizResult {
  constructor(
    id,
    title,
    imageUrl,
    description,
    timeLimit,
    date,
    minimumPointsPrc,
    quizId,
    passed,
    questions
  ) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.date = date;
    this.timeLimit = timeLimit;
    this.minimumPointsPrc = minimumPointsPrc;
    this.quizId = quizId;
    this.passed = passed;
    this.questions = questions;
  }
}
