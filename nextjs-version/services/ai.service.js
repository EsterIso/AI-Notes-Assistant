import OpenAI from "openai";
import 'dotenv/config';
import { extractTextFromPDF, chunkText } from './pdf.service.js';
import { extractTextFromDOCX } from './docx.service.js'; // You'll need to create this

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
        textToProcess = await processLongText(fullText);
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        throw new Error(`PDF processing failed: ${pdfError.message}`);
      }
    } else if (inputType === "docx") {
      if (!originalContent.base64) {
        throw new Error("No DOCX content provided - base64 property missing");
      }

      console.log('Processing DOCX, Base64 length:', originalContent.base64.length);
      
      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(originalContent.base64, "base64");
        console.log('DOCX Buffer created, length:', buffer.length);
        
        // Extract text from DOCX
        const fullText = await extractTextFromDOCX(buffer);
        console.log('Extracted DOCX text length:', fullText.length);
        
        if (!fullText.trim()) {
          throw new Error("No text could be extracted from DOCX - the document might be empty or corrupted");
        }

        // Process based on text length
        textToProcess = await processLongText(fullText);
      } catch (docxError) {
        console.error('DOCX processing error:', docxError);
        throw new Error(`DOCX processing failed: ${docxError.message}`);
      }
    } else {
      throw new Error(`Unsupported inputType: ${inputType}. Supported types: text, pdf, docx`);
    }

    if (!textToProcess.trim()) {
      throw new Error("No text content to process");
    }

    console.log('Final text to process length:', textToProcess.length);

    // Generate AI outputs from the processed text
    const outputs = {};
    
    console.log('Generating summary...');
    outputs.summary = await callOpenAI(
    `Create a comprehensive and in-depth summary of this content following the blueprint structure below.

    BLUEPRINT STRUCTURE TO FOLLOW:
    1. Start with document metadata (authors, affiliations, publication info if available)
    2. Create an "Overview" section with 2-3 paragraphs explaining the main topic and significance
    3. Organize main content under "Key Points" with numbered sections (1, 2, 3, etc.)
    4. Create additional major themed sections with horizontal rules (---) when topics warrant separate coverage
    5. Use descriptive section headers with clear topic identification
    5. Under each key point, use bullet points with detailed explanations
    6. Include relevant case examples or specific details when present
    7. Create additional major sections as needed (like "Additional Insights", methodology sections, etc.)
    8. End with practical implications, conclusions, or future considerations
    9. Include reference/citation information if available

    FORMATTING REQUIREMENTS:
    - Use ### for main section headers
    - Use #### for subsection headers  
    - Use numbered lists for major key points (#### 1. Header, #### 2. Header, etc.)
    - Use bullet points (-) for detailed explanations under each key point
    - Use **bold** for emphasis on important terms, concepts, and key phrases
    - Include specific examples, statistics, case studies, and quantitative data when available
    - Maintain academic/professional tone throughout
    - Ensure each bullet point is substantive (2-3 sentences when possible)
    - Include relevant quotes or specific details to add depth

    DEPTH REQUIREMENTS:
    - Cover each major section or topic thoroughly (not just 1–2 points)
    - Include key details, explanations, and nuances so the summary captures the depth of the material
    - Provide context for why each point matters
    - Explain relationships between different concepts or sections
    - Include practical applications or implications where relevant

    Now create a comprehensive summary of this content following the above blueprint:\n\n${textToProcess}`
    );

    console.log('Generating flashcards...');
    outputs.flashcards = await callOpenAI(
      `Generate 6-10 high-quality educational flashcards from this content covering key concepts, definitions, processes, and applications.

    FLASHCARD REQUIREMENTS:
    - Return a JSON array of objects with "question" and "answer" fields
    - Create a variety of question types: definitions, explanations, applications, comparisons, and case-based scenarios
    - Questions should test different levels of understanding (recall, comprehension, application)
    - Ensure questions are clear, specific, and unambiguous
    - Answers should be comprehensive but concise (2-4 sentences)
    - Include brief context or explanation after the main answer to reinforce learning
    - Cover the most important concepts, terminology, and practical applications from the material
    - Avoid overly simple yes/no questions - focus on substantive learning objectives

    EXAMPLES OF GOOD QUESTION TYPES:
    - "What is [concept] and why is it significant?"
    - "How does [process/intervention] work in [specific context]?"
    - "What are the key differences between [A] and [B]?"
    - "In what situations would you apply [technique/approach]?"
    - "What factors contribute to [phenomenon/condition]?"

    Content to process:
    ${textToProcess}

    Return only valid JSON array:`,
      { format: "json-array" }
    );

    console.log('Generating quiz questions...');
    outputs.quizQuestions = await callOpenAI(
      `Create 5-10 challenging multiple-choice quiz questions from this content that test deep comprehension and application.

    QUIZ REQUIREMENTS:
    - Return a JSON array with "question", "choices" (array of 4 options), "answer" (correct choice index 0-3), and "explanation" (brief rationale for correct answer)
    - Questions should test understanding, not just memorization
    - Include scenario-based and application questions when possible
    - Make distractors (wrong answers) plausible but clearly incorrect to knowledgeable readers
    - Vary question difficulty from moderate to challenging
    - Cover different aspects of the material (concepts, processes, applications, implications)
    - Avoid "all of the above" or "none of the above" options
    - Ensure questions are specific and well-constructed

    QUESTION TYPES TO INCLUDE:
    - Conceptual understanding: "Which statement best describes...?"
    - Application scenarios: "In this situation, what would be the most appropriate...?"
    - Cause and effect: "What is the primary reason that...?"
    - Comparison/analysis: "The main difference between X and Y is...?"
    - Problem-solving: "When faced with [scenario], the best approach would be...?"

    Content to process:
    ${textToProcess}

    Return only valid JSON array:`,
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

// Helper function to process long text (extracted from duplicate code)
const processLongText = async (fullText) => {
  if (fullText.length < 12000) { // ~3k tokens
    console.log('Processing document directly (small size)');
    return fullText;
  } else {
    // Chunk the text and process each chunk
    const chunks = chunkText(fullText, 3000);
    console.log(`Processing ${chunks.length} chunks from document`);
    
    let processedText = "";
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);
      
      const chunkSummary = await callOpenAI(
        `Summarize and extract key information from this text chunk. Keep important details but make it more concise:\n\n${chunks[i]}`
      );
      processedText += chunkSummary + "\n\n";
    }
    return processedText;
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