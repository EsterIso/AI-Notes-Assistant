import OpenAI from "openai";
import 'dotenv/config';
import { extractTextFromPDF, chunkText } from './pdfService.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const processNoteWithAI = async (originalContent, inputType) => {
  try {
    let textToProcess = "";

    console.log('Processing with AI, inputType:', inputType);
    console.log('Original content keys:', Object.keys(originalContent));

    if (inputType === "text") {
      textToProcess = originalContent.text;
      console.log('Text length:', textToProcess.length);
    } else if (inputType === "pdf") {
      if (!originalContent.base64) {
        throw new Error("No PDF content provided - base64 property missing");
      }

      console.log('Base64 length:', originalContent.base64.length);
      
      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(originalContent.base64, "base64");
        console.log('Buffer created, length:', buffer.length);
        
        // Extract text from PDF
        const fullText = await extractTextFromPDF(buffer);
        console.log('Extracted text length:', fullText.length);
        
        if (!fullText.trim()) {
          throw new Error("No text could be extracted from PDF - the PDF might be image-based or corrupted");
        }

        // Process based on text length
        if (fullText.length < 12000) { // ~3k tokens
          textToProcess = fullText;
          console.log('Processing PDF directly (small size)');
        } else {
          // Chunk the text and process each chunk
          const chunks = chunkText(fullText, 3000);
          console.log(`Processing ${chunks.length} chunks from PDF`);
          
          textToProcess = "";
          for (let i = 0; i < chunks.length; i++) {
            console.log(`Processing chunk ${i + 1}/${chunks.length}`);
            
            const chunkSummary = await callOpenAI(
              `Summarize and extract key information from this text chunk. Keep important details but make it more concise:\n\n${chunks[i]}`
            );
            textToProcess += chunkSummary + "\n\n";
          }
        }
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        throw new Error(`PDF processing failed: ${pdfError.message}`);
      }
    } else {
      throw new Error(`Unsupported inputType: ${inputType}`);
    }

    if (!textToProcess.trim()) {
      throw new Error("No text content to process");
    }

    console.log('Final text to process length:', textToProcess.length);

    // Generate AI outputs from the processed text
    const outputs = {};
    
    console.log('Generating summary...');
    outputs.summary = await callOpenAI(
      `Create a comprehensive summary of this content in clear, well-organized bullet points:\n\n${textToProcess}`
    );

    console.log('Generating flashcards...');
    outputs.flashcards = await callOpenAI(
      `Generate 5-8 educational flashcards from this content. Return a JSON array of objects with "question" and "answer" fields. Make questions specific and test understanding:\n\n${textToProcess}\n\nReturn only valid JSON array:`,
      { format: "json-array" }
    );

    console.log('Generating quiz questions...');
    outputs.quizQuestions = await callOpenAI(
      `Create 4-6 multiple-choice quiz questions from this content. Return a JSON array with "question", "choices" (array of 4 options), and "answer" (correct choice index 0-3):\n\n${textToProcess}\n\nReturn only valid JSON array:`,
      { format: "json-array" }
    );

    console.log('Generating action items...');
    outputs.actionItems = await callOpenAI(
      `Extract specific, actionable items, tasks, or next steps from this content. Return a JSON array of strings. If none exist, return an empty array:\n\n${textToProcess}\n\nReturn only valid JSON array:`,
      { format: "json-array" }
    );

    console.log('AI processing completed successfully');
    return outputs;
  } catch (error) {
    console.error("AI processing failed:", error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
};

const callOpenAI = async (prompt, options = {}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    let result = completion.choices[0].message.content;

    if (options.format === "json-array") {
      try {
        // Clean up common JSON formatting issues
        result = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        // Handle case where AI returns just text instead of JSON
        if (!result.startsWith('[') && !result.startsWith('{')) {
          return [result];
        }
        
        const parsed = JSON.parse(result);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return [result];
      }
    }

    return result;
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    return options.format === "json-array" ? ["AI processing failed"] : "AI processing failed";
  }
};