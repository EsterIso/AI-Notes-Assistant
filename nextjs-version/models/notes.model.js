import mongoose from 'mongoose';
import { flashcardSchema } from "./flashcard.model.js";
import { quizQuestionSchema } from "./quizQuestion.model.js";


const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },

    inputType: {
      type: String,
      enum: ["text", "audio", "pdf", "docx", "md"],
      required: true,
    },

    originalContent: {
      text: { type: String },
      fileUrl: { type: String },
    },

    aiOutputs: {
        summary: { type: String },
        flashcards: { type: [flashcardSchema], default: [] },
        quizQuestions: { type: [quizQuestionSchema], default: [] },
        actionItems: { type: [String], default: [] },
    },

    metadata: {
      status: {
        type: String,
        enum: ["pending", "processed", "failed"],
        default: "pending",
      },
      tags: [String],
      sentimentScore: { type: Number },
    },

    exports: {
      pdfUrl: { type: String },
      ankiUrl: { type: String },
    },
  },
  { timestamps: true } // auto adds createdAt + updatedAt
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;