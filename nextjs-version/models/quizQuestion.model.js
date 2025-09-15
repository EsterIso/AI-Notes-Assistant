import mongoose from "mongoose";

export const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: [{ type: String, required: true }],
  answer: { type: String, required: true },
});


const QuizQuestion = mongoose.models.QuizQuestion || mongoose.model("QuizQuestion", quizQuestionSchema);
export default QuizQuestion;