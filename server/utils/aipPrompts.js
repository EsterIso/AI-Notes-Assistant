

export const summaryPrompt = (text) => `
You are an AI assistant that summarizes notes clearly and concisely.
Summarize the following content:

${text}
`;

export const flashcardPrompt = (text) => `
You are an AI assistant that generates study flashcards.
Create flashcards from this note content. Each flashcard should have a "question" and "answer".

${text}
`;

export const quizPrompt = (text) => `
You are an AI assistant that creates quiz questions.
Generate multiple-choice quiz questions from this note content. Include options and the correct answer.

${text}
`;
