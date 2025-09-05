import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

export default mongoose.model("QuizQuestion", quizQuestionSchema);