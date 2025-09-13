import express from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/notes.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 

const router = express.Router();

// Create a new note
router.post('/', protect, createNote);

// Get all notes for the logged-in user
router.get('/', protect, getNotes);

// Get a single note by ID
router.get('/:id', protect, getNoteById);

// Update a note by ID
router.put('/:id', protect, updateNote);

// Delete a note by ID
router.delete('/:id', protect, deleteNote);

export default router;
