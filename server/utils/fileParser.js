import pdfParse from "pdf-parse";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Extract text from a PDF or audio file
 * @param {string} fileUrl - URL or local path of the file
 * @param {"pdf" | "audio"} fileType - Type of file
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromFile = async (fileUrl, fileType) => {
  if (fileType === "pdf") {
    return await extractTextFromPDF(fileUrl);
  } else if (fileType === "audio") {
    return await transcribeAudio(fileUrl);
  } else {
    throw new Error("Unsupported file type for extraction");
  }
};

// --- PDF Extraction ---
const extractTextFromPDF = async (fileUrl) => {
  try {
    // Fetch PDF from URL
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    
    // Use pdf-parse to extract text
    const data = await pdfParse(Buffer.from(buffer));
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
};

// --- Audio Transcription ---
const transcribeAudio = async (fileUrl) => {
  try {
    // Fetch audio file and save temporarily
    const response = await fetch(fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    const tempPath = path.join(process.cwd(), "temp_audio_file.wav");
    fs.writeFileSync(tempPath, buffer);

    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1"
    });

    // Delete temp file
    fs.unlinkSync(tempPath);

    return transcription.text;
  } catch (error) {
    console.error("Audio transcription error:", error.message);
    throw new Error("Failed to transcribe audio file");
  }
};
