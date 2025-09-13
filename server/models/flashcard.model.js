import mongoose from "mongoose";

export const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export default mongoose.model("Flashcard", flashcardSchema);