import Quiz from "../models/quiz";
import {
  QUESTION_TYPE,
  OpenQuestion,
  SingleChoiceQuestion,
} from "../models/question";

export const QUIZZES = [
  new Quiz(
    "q1",
    ".Net Quiz for Beginners",
    "https://dotnetfoundation.org/img/dot_bot.png",
    "Test your skills in .Net platform. We have 20 questions for you that will test your knowledge and will help you test your knowledge." +
      "Please have in mind that you can take the test only once. 80% is the minimum to pass it successfully.",
    { min: 25, sec: 30 },
    new Date(2020, 1, 30),
    70
  ),
  new Quiz(
    "q2",
    ".Net Quiz for mid-level",
    "https://dotnetfoundation.org/img/dot_bot.png",
    "Test your skills in .Net platform. We have 20 questions for you that will test your knowledge and will help you test your knowledge." +
      "You will have 20 minutes to complete the test. 80% is the minimum to pass it successfully.",
    { min: 0, sec: 60 },
    new Date(2020, 2, 15),
    70
  ),
  new Quiz(
    "q3",
    "Javascript ECMAScript 2020",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2020? Test your knowledge with our 5 questions quiz",
    { min: 25, sec: 40 },
    new Date(2020, 3, 13),
    70
  ),
  new Quiz(
    "q4",
    "Javascript ECMAScript 2015",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2020? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2015, 3, 13),
    70
  ),
  new Quiz(
    "q5",
    "Javascript ECMAScript 2016",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2020? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2016, 3, 13),
    70
  ),
  new Quiz(
    "q6",
    "Javascript ECMAScript 2017",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2020? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2017, 3, 13),
    70
  ),
  new Quiz(
    "q7",
    "Javascript ECMAScript 2018",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2018? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2018, 3, 13),
    70
  ),
  new Quiz(
    "q8",
    "Javascript ECMAScript 2019",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2019? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2019, 3, 13),
    70
  ),
  new Quiz(
    "q9",
    "Javascript ECMAScript 2019",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2019? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2019, 3, 13),
    70
  ),
  new Quiz(
    "q10",
    "Javascript ECMAScript 2019",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2019? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2019, 3, 13),
    70
  ),
  new Quiz(
    "q11",
    "Javascript ECMAScript 2019",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2019? Test your knowledge with our 5 questions quiz",
    { min: 25, sec: 40 },
    new Date(2019, 3, 13),
    70
  ),
  new Quiz(
    "q12",
    "Javascript ECMAScript 2019",
    "https://miro.medium.com/max/1575/1*CQZ0xcoMdj2QaINRR0MI9w.gif",
    "What's new in ECMAScript 2019? Test your knowledge with our 5 questions quiz",
    null,
    new Date(2019, 3, 13),
    70
  ),
];

export const HISTORY_QUIZZES = QUIZZES.filter((q) => {
  return ["q2", "q6", "q7", "q11", "q9"].find((c) => c === q.id);
}).map((q) => {
  return {
    ...q,
    passed: q.id !== "q9",
  };
});

export const QUESTIONS = [];
let question = new SingleChoiceQuestion(
  "q1",
  1,
  "Which of the following keyword is used for including the namespaces in the program in C#?",
  1,
  "q1"
);
question.addPossibleAnswer(1, "imports");
question.addPossibleAnswer(2, "using");
question.addPossibleAnswer(3, "exports");
question.addPossibleAnswer(4, "None of the above.");
question.setCorrectAnswer(2);

QUESTIONS.push(question);
///
question = new SingleChoiceQuestion(
  "q2",
  2,
  " Which of the following defines unboxing correctly?",
  2,
  "q1"
);
question.addPossibleAnswer(
  1,
  "When a value type is converted to object type, it is called unboxing."
);
question.addPossibleAnswer(
  2,
  "When an object type is converted to a value type, it is called unboxing."
);
question.addPossibleAnswer(3, "Both of the above.");
question.addPossibleAnswer(4, "None of the above.");
question.setCorrectAnswer(2);
QUESTIONS.push(question);
///
question = new SingleChoiceQuestion(
  "q3",
  3,
  "Which member access modifier makes members accessible only within the body of the class or the struct in which they are declared ?",
  1,
  "q1"
);
question.addPossibleAnswer(1, "private");
question.addPossibleAnswer(2, "public");
question.addPossibleAnswer(3, "protected");
question.addPossibleAnswer(4, "internal");
question.setCorrectAnswer(1);
QUESTIONS.push(question);

///
question = new OpenQuestion(
  "q4",
  4,
  "Which keyword is used in method declaration to allow for it to be overridden in a derived class?",
  3,
  "q1"
);
//question.setCorrectAnswer("virtual");
question.setCorrectAnswer("virtual");
QUESTIONS.push(question);

///
question = new SingleChoiceQuestion(
  "q5",
  5,
  "Which of the following is not true about abstract classes?",
  2,
  "q1"
);
question.addPossibleAnswer(1, "An abstract class cannot be instantiated");
question.addPossibleAnswer(
  2,
  "The purpose of an abstract class is to provide a common definition of a base class that multiple derived classes can share"
);
question.addPossibleAnswer(
  3,
  "Abstract classes can not have implemented methods"
);
question.addPossibleAnswer(
  4,
  "Abstract classes may also define abstract methods"
);
question.setCorrectAnswer(3);
QUESTIONS.push(question);
export const QUIZ_QUESTIONS = QUESTIONS;
