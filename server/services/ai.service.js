import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const processNoteWithAI = async (originalContent, inputType) => {
  try {
    let textToProcess = "";

    if (inputType === "text") {
      textToProcess = originalContent.text;
    } else if (inputType === "pdf" || inputType === "audio") {
      textToProcess = await extractTextFromFile(originalContent.fileUrl, inputType);
    }

    const outputs = {};

    // 🔹 Summary
    outputs.summary = await callOpenAI(
      `Summarize this text in clear, concise bullet points:\n\n${textToProcess}`
    );

    // 🔹 Flashcards
    outputs.flashcards = await callOpenAI(
      `Generate flashcards (question + answer) from this text:\n\n${textToProcess}`,
      { format: "json-array" } // optional: tell AI to return JSON array
    );

    // 🔹 Quiz Questions
    outputs.quizQuestions = await callOpenAI(
      `Create 5 multiple-choice quiz questions (question + 4 options + correct answer) from this text:\n\n${textToProcess}`,
      { format: "json-array" }
    );

    // 🔹 Action Items
    outputs.actionItems = await callOpenAI(
      `List actionable items from this text:\n\n${textToProcess}`,
      { format: "json-array" }
    );

    return outputs;
  } catch (error) {
    console.error("AI processing failed:", error);
    throw new Error("AI processing failed");
  }
};

// Helper to call OpenAI API
const callOpenAI = async (prompt, options = {}) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  // By default, take AI text response
  let result = completion.choices[0].message.content;

  // If expecting JSON output (like flashcards or quiz), try parsing it
  if (options.format === "json-array") {
    try {
      result = JSON.parse(result);
    } catch (err) {
      console.warn("Failed to parse AI JSON, returning raw string");
    }
  }

  return result;
};

// Helper for extracting text from PDF/audio (placeholder)
const extractTextFromFile = async (fileUrl, inputType) => {
  // TODO: implement PDF parsing or speech-to-text
  return `Extracted text from ${inputType} at ${fileUrl}`;
};
