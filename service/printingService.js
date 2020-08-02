import colors from "../constants/colors";
import * as quizService from "./quizService";
import * as Print from "expo-print";

export const printUserScores = async (quizzes) => {
  let content = "";
  quizzes.forEach((q) => {
    const totalPoints = quizService.calculateQuizTotalPoints(q.questions);
    const userPoints = quizService.calculateQuizEarnedPoints(q.questions);
    let score = 100;
    if (totalPoints) {
      score = Math.round((userPoints / totalPoints) * 10000, 2) / 100;
    }
    const passed = quizService.isPassed(q, q.questions);

    content += `<h3 style="margin:0">${q.title}</h3>`;
    if (passed) {
      content += `<h5 style="color:green;margin:0">PASSED</h5>`;
    } else {
      content += `<h5 style="color:red;margin:0">FAILED</h5>`;
    }
    content += `<p>`;
    content += `Date: ${q.date.toDateString()}<br>`;
    content += `Total Points: ${totalPoints}<br>`;
    content += `Your Points: ${userPoints}<br>`;
    content += `Score: ${score}%<br>`;
    content += `Target Score: ${q.minimumPointsPrc}%<br>`;
    content += `</p>`;
    content += `<hr>`;
  });
  content = packageHTML(content);
  return await Print.printAsync({ html: content });
};

export const printSingleQuizResult = async (quiz) => {
  let content = "";
  const totalPoints = quizService.calculateQuizTotalPoints(quiz.questions);
  const userPoints = quizService.calculateQuizEarnedPoints(quiz.questions);
  let score = 100;
  if (totalPoints) {
    score = Math.round((userPoints / totalPoints) * 10000, 2) / 100;
  }
  const passed = quizService.isPassed(quiz, quiz.questions);

  content += `<h3 style="margin:0">${quiz.title}</h3>`;
  if (passed) {
    content += `<h5 style="color:green;margin:0">PASSED</h5>`;
  } else {
    content += `<h5 style="color:red;margin:0">FAILED</h5>`;
  }
  content += `<img src=${quiz.imageUrl} width="200" height="auto">`;
  content += `<p>`;
  content += `Date: ${quiz.date.toDateString()}<br>`;
  content += `Total Points: ${totalPoints}<br>`;
  content += `Your Points: ${userPoints}<br>`;
  content += `Score: ${score}%<br>`;
  content += `Target Score: ${quiz.minimumPointsPrc}%<br>`;
  content += `</p>`;
  content += `<hr>`;
  content = packageHTML(content);
  return await Print.printAsync({ html: content });
};

const packageHTML = (content) => {
  let html = `<!DOCTYPE html><head><title>User Scores</title></head>`;
  html += `<body style="text-align:center;background-color:${colors.backColor}"><hr>${content}</body>`;
  html += `</html>`;
  return html;
};
