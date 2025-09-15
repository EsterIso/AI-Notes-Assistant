import { useState, useEffect } from 'react';
import { 
    getNotes, 
    createNoteFromFile,
    createTextNote,
    updateNote, 
    deleteNote
} from '../services/noteService';
import { toast } from 'react-toastify';

function useNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        notes: 0,
        flashcards: 0,
        quizzes: 0
    });

    // Calculate stats from notes
    const calculateStats = (notesArray) => ({
        notes: notesArray.length,
        flashcards: notesArray.reduce((total, note) => total + (note.aiOutputs?.flashcards?.length || 0), 0),
        quizzes: notesArray.reduce((total, note) => total + (note.aiOutputs?.quizQuestions?.length || 0), 0)
    });

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getNotes();

            if (response.success) {
                setNotes(response.notes);
                setStats(calculateStats(response.notes));
            } else {
                throw new Error(response.message || 'Failed to fetch notes');
            }
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError(err.message);
            toast.error('Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    // Create a new text note
    const handleCreateTextNote = async (title, content) => {
        try {
            setLoading(true);
            const response = await createTextNote(title, content);

            if (response.success) {
                toast.success('Note created successfully!');
                await fetchNotes();
                return response.note;
            } else {
                throw new Error(response.message || 'Failed to create note');
            }
        } catch (err) {
            console.error('Error creating text note:', err);
            toast.error(err.message || 'Failed to create note');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Create note from PDF file
    const handleCreateNoteFromFile = async (file, title = null) => {
        try {
            setLoading(true);

            if (file.type !== 'application/pdf') {
                throw new Error('Please upload a PDF file only');
            }

            const maxSize = 100 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                throw new Error('File size must be less than 50MB');
            }

            // Directly pass the file to the service; service will handle base64 conversion
            const response = await createNoteFromFile(file, title);

            if (response.success) {
                toast.success('PDF note created successfully!');
                await fetchNotes();
                return response.note;
            } else {
                throw new Error(response.message || 'Failed to create note from file');
            }
        } catch (err) {
            console.error('Error creating note from file:', err);
            toast.error(err.message || 'Failed to create note from PDF');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update an existing note
    const handleUpdateNote = async (id, noteData) => {
        try {
            setLoading(true);
            const response = await updateNote(id, noteData);

            if (response.success) {
                toast.success('Note updated successfully!');
                await fetchNotes();
                return response.note;
            } else {
                throw new Error(response.message || 'Failed to update note');
            }
        } catch (err) {
            console.error('Error updating note:', err);
            toast.error(err.message || 'Failed to update note');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a note
    const handleDeleteNote = async (id) => {
        try {
            setLoading(true);
            const response = await deleteNote(id);

            if (response.success) {
                toast.success('Note deleted successfully!');
                await fetchNotes();
                return true;
            } else {
                throw new Error(response.message || 'Failed to delete note');
            }
        } catch (err) {
            console.error('Error deleting note:', err);
            toast.error(err.message || 'Failed to delete note');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get recent notes (first 3)
    const getRecentNotes = () => notes.slice(0, 3).map(note => ({
        id: note._id,
        title: note.title,
        summary: note.aiOutputs?.summary?.substring(0, 60) + '...' || 'Processing...',
        date: new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: note.metadata?.status || 'processing'
    }));

    // Load notes on hook initialization
    useEffect(() => {
        fetchNotes();
    }, []);

    return {
        notes,
        loading,
        error,
        stats,
        fetchNotes,
        handleCreateTextNote,
        handleCreateNoteFromFile,
        handleUpdateNote,
        handleDeleteNote,
        recentNotes: getRecentNotes()
    };
}

export default useNotes;
