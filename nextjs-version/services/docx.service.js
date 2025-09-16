import mammoth from 'mammoth';

export async function extractTextFromDOCX(buffer) {
  try {
    console.log('Starting DOCX text extraction...');
    console.log('Buffer type:', typeof buffer);
    console.log('Buffer length:', buffer.length);
    
    // mammoth expects a Buffer, make sure we have one
    if (!(buffer instanceof Buffer)) {
      console.log('Converting to Buffer...');
      buffer = Buffer.from(buffer);
    }
    
    // Extract text from DOCX using mammoth
    const result = await mammoth.extractRawText({ buffer });
    console.log('DOCX extraction successful, text length:', result.value.length);
    
    if (result.messages && result.messages.length > 0) {
      console.log('DOCX extraction messages:', result.messages);
    }
    
    return result.value;
  } catch (error) {
    console.error("DOCX text extraction failed:", error);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}