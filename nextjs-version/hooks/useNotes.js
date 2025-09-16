import { useState, useEffect } from 'react';
import { 
    getNotes, 
    createNoteFromFile,
    createTextNote,
    updateNote, 
    deleteNote,
    SUPPORTED_FILE_TYPES
} from '../services/note.service';
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

    // Validate file before upload
    const validateFileType = (file) => {
        const fileConfig = SUPPORTED_FILE_TYPES[file.type];
        
        if (!fileConfig) {
            // Check by file extension as fallback
            const extension = file.name.split('.').pop().toLowerCase();
            const configByExtension = Object.values(SUPPORTED_FILE_TYPES).find(config => config.extension === extension);
            
            if (!configByExtension) {
                return {
                    isValid: false,
                    error: 'File type not supported. Supported formats: PDF, DOCX, DOC, TXT, MD, HTML, RTF, ODT, XML, JSON, TEX'
                };
            }
            return { isValid: true, config: configByExtension };
        }
        
        const maxSize = fileConfig.maxSize * 1024 * 1024; // Convert MB to bytes
        if (file.size > maxSize) {
            return {
                isValid: false,
                error: `File size must be less than ${fileConfig.maxSize}MB for ${fileConfig.extension.toUpperCase()} files`
            };
        }
        
        return { isValid: true, config: fileConfig };
    };

    // Create note from any supported file type
    const handleCreateNoteFromFile = async (file, title = null) => {
        try {
            setLoading(true);

            // Validate file type and size
            const validation = validateFileType(file);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            // Show different loading messages based on file type
            const fileExtension = validation.config.extension.toUpperCase();
            if (validation.config.needsConversion) {
                toast.info(`Processing ${fileExtension} file... This may take a moment.`);
            } else {
                toast.info(`Processing ${fileExtension} file...`);
            }

            // Directly pass the file to the service; service will handle conversion
            const response = await createNoteFromFile(file, title);

            if (response.success) {
                toast.success(`${fileExtension} note created successfully!`);
                await fetchNotes();
                return response.note;
            } else {
                throw new Error(response.message || 'Failed to create note from file');
            }
        } catch (err) {
            console.error('Error creating note from file:', err);
            toast.error(err.message || 'Failed to create note from file');
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

    // Get supported file extensions for display
    const getSupportedExtensions = () => {
        return Object.values(SUPPORTED_FILE_TYPES).map(config => config.extension.toUpperCase()).join(', ');
    };

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
        recentNotes: getRecentNotes(),
        supportedExtensions: getSupportedExtensions(),
        validateFileType
    };
}

export default useNotes;