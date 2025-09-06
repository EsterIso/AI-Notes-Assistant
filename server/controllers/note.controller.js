import Note from '../models/note.model.js';
import { parseFile } from '../utils/fileParser.js';
import { openai } from '../config/openai.js';
import { summaryPrompt, flashcardPrompt, quizPrompt } from '../utils/aiPrompts.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createNote = async (req, res) => {
    try {
        const { title, inputType, originalContent } = req.body;

        if (!title || !inputType || !originalContent) {
            return res.status(400).json({
                success: false,
                message: 'Title, inputType, and originalContent are required'
            });
        }

        let textContent = originalContent.text || '';

        // Parse file content if the note is a file
        if (inputType === 'pdf' || inputType === 'audio') {
            textContent = await parseFile(originalContent.fileUrl, inputType);
        }

        // Generate summary using prompt
        const summaryResponse = await openai.chat.completions.create({
            model: 'gpt-5-mini',
            messages: [{ role: 'user', content: summaryPrompt(textContent) }]
        });
        const summary = summaryResponse.choices[0].message.content;

        // Generate flashcards using prompt
        const flashcardsResponse = await openai.chat.completions.create({
            model: 'gpt-5-mini',
            messages: [{ role: 'user', content: flashcardPrompt(textContent) }]
        });
        const flashcards = JSON.parse(flashcardsResponse.choices[0].message.content || '[]');

        // Generate quiz questions using prompt
        const quizResponse = await openai.chat.completions.create({
            model: 'gpt-5-mini',
            messages: [{ role: 'user', content: quizPrompt(textContent) }]
        });
        const quizQuestions = JSON.parse(quizResponse.choices[0].message.content || '[]');

        // Optional: generate embeddings for semantic search
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-large',
            input: textContent
        });
        const embeddings = embeddingResponse.data[0].embedding;

        // Save the note
        const note = new Note({
            userId: req.user.userId,
            title,
            inputType,
            originalContent,
            aiOutputs: {
                summary,
                flashcards,
                quizQuestions,
                actionItems: [] 
            },
            metadata: { status: 'processed' },
            embeddings
        });

        const savedNote = await note.save();

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note: savedNote
        });
    } catch (error) {
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
        res.json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching notes', error: error.message });
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
        res.status(500).json({ success: false, message: 'Error fetching note', error: error.message });
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
        res.status(500).json({ success: false, message: 'Error deleting note', error: error.message });
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

        let textContent = originalContent?.text || note.originalContent?.text || '';

        // Parse file content if inputType is file
        if (note.inputType === 'pdf' || note.inputType === 'audio') {
            textContent = await parseFile(originalContent?.fileUrl || note.originalContent?.fileUrl, note.inputType);
        }

        // Regenerate AI outputs if requested
        if (regenerateAI) {
            const summaryResponse = await openai.chat.completions.create({
                model: 'gpt-5-mini',
                messages: [{ role: 'user', content: summaryPrompt(textContent) }]
            });
            const summary = summaryResponse.choices[0].message.content;

            const flashcardsResponse = await openai.chat.completions.create({
                model: 'gpt-5-mini',
                messages: [{ role: 'user', content: flashcardPrompt(textContent) }]
            });
            const flashcards = JSON.parse(flashcardsResponse.choices[0].message.content || '[]');

            const quizResponse = await openai.chat.completions.create({
                model: 'gpt-5-mini',
                messages: [{ role: 'user', content: quizPrompt(textContent) }]
            });
            const quizQuestions = JSON.parse(quizResponse.choices[0].message.content || '[]');

            // Update embeddings
            const embeddingResponse = await openai.embeddings.create({
                model: 'text-embedding-3-large',
                input: textContent
            });
            const embeddings = embeddingResponse.data[0].embedding;

            note.aiOutputs = { summary, flashcards, quizQuestions, actionItems: [] };
            note.embeddings = embeddings;
            note.metadata.status = 'processed';
        }

        const updatedNote = await note.save();

        res.json({ success: true, message: 'Note updated successfully', note: updatedNote });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating note', error: error.message });
    }
};

