import React, { useState } from "react";
import { Modal, Alert, StyleSheet, ScrollView } from "react-native";
import QuizHeader from "./QuizHeader";
import Question from "./Question";
import { Quiz } from "../../../models/quiz";
import {
  QUESTION_TYPE,
  SingleChoiceQuestion,
  OpenQuestion,
} from "../../../models/question";
export const STATE = {
  CREATE_UPDATE_QUIZ: "CREATE_UPDATE_QUIZ",
  ADD_QUESTIONS: "ADD_QUESTIONS",
};

const QuizWizard = (props) => {
  const [screenState, setScreenState] = useState(STATE.CREATE_UPDATE_QUIZ);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState(QUESTION_TYPE.SINGLE_CHOICE);
  const [position, setPosition] = useState(-1);
  const [currQuestion, setCurrQuestion] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);

  const createUpdateQuizHeaderHandler = (quiz) => {
    console.log(`Minimum points: ${quiz.minimumPointsPrc}`);
    const newQuiz = new Quiz(
      0,
      quiz.title,
      quiz.imageUrl,
      quiz.description,
      quiz.timeLimit,
      new Date(Date.now()),
      quiz.minimumPointsPrc,
      ""
    );
    console.log(newQuiz);
    setQuiz(newQuiz);
  };

  const addQuestionHandlerFromHeader = () => {
    if (questions.length === 0) {
      addQuestionHandler();
    } else {
      setScreenState(STATE.ADD_QUESTIONS);
      setCurrQuestion(questions[position]);
      setQuestionType(questions[position].type);
    }
  };

  const addQuestionHandler = () => {
    Alert.alert("Question type", "What kind of question do you want to add ?", [
      {
        text: "Open question",
        onPress: () => {
          setQuestionType(QUESTION_TYPE.OPEN_QUESTION);
          setScreenState(STATE.ADD_QUESTIONS);
          setQuestionsCount(questionsCount + 1);
          setPosition(position + 1);
          setCurrQuestion(null);
        },
      },
      {
        text: "Single choice question",
        onPress: () => {
          setQuestionType(QUESTION_TYPE.SINGLE_CHOICE);
          setScreenState(STATE.ADD_QUESTIONS);
          setQuestionsCount(questionsCount + 1);
          setPosition(position + 1);
          setCurrQuestion(null);
        },
      },
    ]);
  };

  const createQuestionHandler = (question) => {
    setQuestions(questions.concat(question));
  };

  const updateQuestionHandler = (question) => {
    const updatedQuestions = questions;
    updatedQuestions[position] = question;
    setQuestions(updatedQuestions);
  };

  const removeQuestionHandler = () => {
    const updatedQuestions = questions.filter((q, indx) => {
      return indx != position;
    });
    let newPosition = position;
    if (position >= updatedQuestions.length && position > 0) {
      newPosition = updatedQuestions.length - 1;
    }
    setQuestions(updatedQuestions);
    setPosition(newPosition);
    setCurrQuestion(updatedQuestions[newPosition] ?? null);
    setQuestionType(
      updatedQuestions[newPosition]
        ? updatedQuestions[newPosition].type
        : QUESTION_TYPE.SINGLE_CHOICE
    );
    setQuestionsCount(questionsCount - 1);
  };

  const exitHandler = () => {
    setScreenState(STATE.CREATE_UPDATE_QUIZ);
    setCurrQuestion(null);
  };

  const previousHandler = () => {
    const updatedQuestions = questions;
    const newPosition = position - 1;
    setPosition(newPosition);
    setCurrQuestion(updatedQuestions[newPosition] ?? null);
    setQuestionType(updatedQuestions[newPosition].type);
  };

  const nextHandler = () => {
    const newPosition = position + 1;
    setPosition(newPosition);
    setCurrQuestion(questions[newPosition] ?? null);
    setQuestionType(questions[newPosition].type);
  };

  let content = null;
  switch (screenState) {
    case STATE.CREATE_UPDATE_QUIZ:
      content = (
        <QuizHeader
          quiz={quiz}
          onCreateUpdateQuizHeader={createUpdateQuizHeaderHandler}
          onAddQuestion={addQuestionHandlerFromHeader}
          onSubmit={async () => {
            let number = 0;
            let quizQuestions = questions.map((q) => {
              let question = null;
              number += 1;
              switch (q.type) {
                case QUESTION_TYPE.SINGLE_CHOICE:
                  question = new SingleChoiceQuestion(
                    0,
                    number,
                    q.question,
                    q.points,
                    ""
                  );
                  question.possibleAnswers = q.possibleAnswers;
                  break;
                case QUESTION_TYPE.OPEN_QUESTION:
                  question = new OpenQuestion(
                    0,
                    number,
                    q.question,
                    q.points,
                    ""
                  );
                  question.setCorrectAnswer(q.correctAnswer);
                  break;
              }
              return question;
            });
            await props.onSubmitQuiz(quiz, quizQuestions);
          }}
          questionsCount={questions.length}
        />
      );
      break;
    case STATE.ADD_QUESTIONS:
      content = (
        <Question
          type={questionType}
          isFirst={position === 0}
          isLast={questions.length <= position + 1}
          questionNumber={position + 1}
          questionsCount={questionsCount}
          onPrevious={previousHandler}
          onExit={exitHandler}
          onNext={nextHandler}
          question={currQuestion}
          onAddQuestion={addQuestionHandler}
          onCreateQuestion={createQuestionHandler}
          onUpdateQuestion={updateQuestionHandler}
          onRemoveQuestion={removeQuestionHandler}
        />
      );
  }
  console.log(questions);
  console.log(position);
  console.log(currQuestion);
  return (
    <Modal
      transparent={false}
      animationType={"slide"}
      onRequestClose={() => {
        Alert.alert(
          "Exit quiz wizard",
          "If you exit the wizard your changes would not be saved. Do you want to exit ?",
          [
            { text: "Cancel" },
            {
              text: "Exit",
              onPress: () => {
                props.onGoBack();
              },
            },
          ]
        );
      }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {content}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});
export default QuizWizard;
