import {
  QUESTION_TYPE,
  SingleChoiceQuestion,
  OpenQuestion,
} from "../models/question";
import { Quiz, QuizResult } from "../models/quiz";
import * as authService from "./authService";
import { URL } from "../constants/api";

export const QUIZ_STATUS = {
  NONE: "NONE",
  INIT: "INIT",
  STARTED: "STARTED",
  FINISHED: "FINISHED",
  REVIEW: "REVIEW",
  ERROR: "ERROR",
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

export const isPassed = (quiz, questions) => {
  const totalPoints = calculateQuizTotalPoints(questions);
  const userPoints = calculateQuizEarnedPoints(questions);
  const minimumPoints = (quiz.minimumPointsPrc / 100) * totalPoints;
  return !quiz.minimumPointsPrc || minimumPoints <= userPoints;
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

export const createAnsweredQuestionFromJson = (id, jsonData) => {
  const question = createQuestionFromJson(id, jsonData);
  return question.setAnswer(jsonData.userAnswer);
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

export const insertFullQuiz = async (quiz, questions) => {
  const newQuiz = await insertQuiz(quiz);
  questions.forEach(async (q) => {
    q.quizId = newQuiz.id;
    await insertQuestion(q);
  });
  return newQuiz;
};

export const insertQuiz = async (quiz) => {
  if (!(await authService.refreshTokenIfExpired())) {
    return false;
  }
  const tokenId = await authService.getTokenId();
  const userId = authService.getUserId();
  const response = await fetch(`${URL}/quiz.json?auth=${tokenId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: quiz.title,
      imageUrl: quiz.imageUrl
        ? quiz.imageUrl
        : "https://cdn.pixabay.com/photo/2017/05/13/09/04/question-2309040_1280.jpg",
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      date: quiz.date,
      minimumPointsPrc: quiz.minimumPointsPrc,
      ownerId: userId,
    }),
  });
  if (!response.ok) {
    console.log(`ADD_QUIZ: Error response: ${JSON.stringify(response)}`);
    throw new Error(
      `Something went wrong. ${response.statusText ? response.statusText : ""}`
    );
  }
  const resData = await response.json();
  const newQuiz = new Quiz(
    resData.name,
    quiz.title,
    quiz.imageUrl,
    quiz.description,
    quiz.timeLimit,
    quiz.date,
    quiz.minimumPointsPrc,
    userId
  );
  return newQuiz;
};

export const insertQuestion = async (question) => {
  if (!(await authService.refreshTokenIfExpired())) {
    return false;
  }
  const tokenId = await authService.getTokenId();

  const response = await fetch(`${URL}/question.json?auth=${tokenId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: createJsonFromQuestion(question),
  });

  if (!response.ok) {
    console.log(`ADD_QUESTION: Error response: ${JSON.stringify(response)}`);
    throw new Error(
      `Something went wrong. ${response.statusText ? response.statusText : ""}`
    );
  }
  const resData = await response.json();
  return resData.name;
};

export const fetchQuestions = async (quizId) => {
  if (!(await authService.refreshTokenIfExpired())) {
    return false;
  }
  const tokenId = await authService.getTokenId();
  const response = await fetch(
    `${URL}/question.json?auth=${tokenId}&orderBy="quizId"&equalTo="${quizId}"`
  );
  if (!response.ok) {
    console.log(`GET_QUESTIONS: Error response: ${JSON.stringify(response)}`);
    throw new Error(
      `Something went wrong. ${response.statusText ? response.statusText : ""}`
    );
  }
  const resData = await response.json();
  let loadedQuestions = [];
  for (const key in resData) {
    loadedQuestions.push(createQuestionFromJson(key, resData[key]));
  }
  return loadedQuestions;
};

export const fetchQuizzes = async () => {
  if (!(await authService.refreshTokenIfExpired())) {
    return false;
  }
  const tokenId = await authService.getTokenId();
  const response = await fetch(`${URL}/quiz.json?auth=${tokenId}`);
  if (!response.ok) {
    console.log(`GET_QUIZZES: Error response: ${JSON.stringify(response)}`);
    throw new Error(
      `Something went wrong. ${response.statusText ? response.statusText : ""}`
    );
  }
  const resData = await response.json();
  let loadedQuizzes = [];
  for (const key in resData) {
    const quiz = new Quiz(
      key,
      resData[key].title,
      resData[key].imageUrl,
      resData[key].description,
      resData[key].timeLimit,
      new Date(resData[key].date),
      resData[key].minimumPointsPrc,
      resData[key].ownerId
    );
    loadedQuizzes.push(quiz);
  }
  return loadedQuizzes;
};

export const insertQuizResults = async (quiz, questions) => {
  if (!(await authService.refreshTokenIfExpired())) {
    return false;
  }
  const tokenId = await authService.getTokenId();
  const userId = authService.getUserId();
  const date = new Date();
  const passed = isPassed(quiz, questions);
  const response = await fetch(
    `${URL}/quizResults/${userId}.json?auth=${tokenId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: quiz.title,
        imageUrl: quiz.imageUrl,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        date: date,
        minimumPointsPrc: quiz.minimumPointsPrc,
        quizId: quiz.id,
        passed: passed,
        questions: questions,
      }),
    }
  );
  if (!response.ok) {
    console.log(`ADD_RESULTS: Error response: ${JSON.stringify(response)}`);
    throw new Error(
      `Something went wrong. ${response.statusText ? response.statusText : ""}`
    );
  }
  const resData = await response.json();
  const newQuizResults = new QuizResult(
    resData.name,
    quiz.title,
    quiz.imageUrl,
    quiz.description,
    quiz.timeLimit,
    date,
    quiz.minimumPointsPrc,
    quiz.id,
    passed,
    questions
  );
  return newQuizResults;
};

export const fetchUserQuizzes = async () => {
  if (!(await authService.refreshTokenIfExpired())) {
    return false;
  }
  const tokenId = await authService.getTokenId();
  const userId = authService.getUserId();
  const response = await fetch(`${URL}/quizResults/${userId}.json?auth=${tokenId}`);
  if (!response.ok) {
    console.log(
      `GET_USER_QUIZZES: Error response: ${JSON.stringify(response)}`
    );
    throw new Error(
      `Something went wrong. ${response.statusText ? response.statusText : ""}`
    );
  }
  const resData = await response.json();
  let loadedQuizzes = [];
  for (const key in resData) {
    const quizQuestions = [];
    resData[key].questions.forEach((q) => {
      quizQuestions.push(createAnsweredQuestionFromJson(q.id, q));
    });

    const quiz = new QuizResult(
      key,
      resData[key].title,
      resData[key].imageUrl,
      resData[key].description,
      resData[key].timeLimit,
      new Date(resData[key].date),
      resData[key].minimumPointsPrc,
      resData[key].quizId,
      resData[key].passed,
      quizQuestions
    );
    loadedQuizzes.push(quiz);
  }
  return loadedQuizzes;
};
