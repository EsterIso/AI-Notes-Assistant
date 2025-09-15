import Note from '../models/notes.model.js';
import { processNoteWithAI } from '../services/ai.service.js';


export const createNote = async (req, res) => {
  try {
    const { title, inputType, originalContent } = req.body;

    console.log('Create note request:', { title, inputType, contentType: typeof originalContent });

    if (!title || !inputType || !originalContent) {
      return res.status(400).json({
        success: false,
        message: 'Title, inputType, and originalContent are required'
      });
    }

    // Process the content with AI
    let aiOutputs;
    try {
      aiOutputs = await processNoteWithAI(originalContent, inputType);
    } catch (err) {
      console.error("AI processing failed:", err);
      return res.status(500).json({ 
        success: false, 
        message: `AI processing failed: ${err.message}` 
      });
    }

    // Save note to MongoDB (assuming Note model is imported)
    const note = new Note({
      userId: req.user.userId,
      title,
      inputType,
      originalContent,
      aiOutputs,
      metadata: { 
        status: 'processed',
        processedAt: new Date(),
        wordCount: inputType === 'text' ? originalContent.text?.split(' ').length : null
      }
    });

    const savedNote = await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: savedNote
    });

  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error.message
    });
  }
};

// Get all notes for a user
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json({ success: true, notes: notes });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching notes', 
            error: error.message 
        });
    }
};

// Get a single note
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        res.json({ success: true, note });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching note', 
            error: error.message 
        });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        res.json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting note', 
            error: error.message 
        });
    }
};

// Update a note
export const updateNote = async (req, res) => {
    try {
        const { title, originalContent, regenerateAI } = req.body;

        const note = await Note.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        // Update title/content if provided
        if (title) note.title = title;
        if (originalContent) note.originalContent = originalContent;

        // Regenerate AI outputs if requested
        if (regenerateAI) {
            const aiOutputs = await processNoteWithAI(
                originalContent || note.originalContent, 
                note.inputType
            );
            note.aiOutputs = aiOutputs;
            note.metadata.status = 'processed';
        }

        const updatedNote = await note.save();

        res.json({ 
            success: true, 
            message: 'Note updated successfully', 
            note: updatedNote 
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating note', 
            error: error.message 
        });
    }
};