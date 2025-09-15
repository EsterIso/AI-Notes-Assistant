import mongoose from "mongoose";

export const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const Flashcard = mongoose.models.Flashcard || mongoose.model("Flashcard", flashcardSchema);
export default Flashcard;