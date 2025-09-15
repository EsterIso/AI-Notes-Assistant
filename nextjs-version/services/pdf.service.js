import 'dotenv/config';
import pdf from 'pdf-parse';

export async function extractTextFromPDF(buffer) {
  try {
    console.log('Starting PDF text extraction...');
    console.log('Buffer type:', typeof buffer);
    console.log('Buffer length:', buffer.length);
    
    // pdf-parse expects a Buffer, make sure we have one
    if (!(buffer instanceof Buffer)) {
      console.log('Converting to Buffer...');
      buffer = Buffer.from(buffer);
    }
    
    const data = await pdf(buffer);
    console.log('PDF extraction successful, text length:', data.text.length);
    
    return data.text;
  } catch (error) {
    console.error("PDF text extraction failed:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

export const chunkText = (text, maxTokens = 3000) => {
  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const estimatedTokens = (currentChunk + sentence).length / 4;
    
    if (estimatedTokens > maxTokens && currentChunk.trim()) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + ' ';
    } else {
      currentChunk += sentence + ' ';
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length ? chunks : [text];
};