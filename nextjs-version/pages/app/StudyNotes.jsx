import { useState, useEffect } from 'react';
import { 
    FileText, 
    Search, 
    Eye, 
    Trash2,
    BookOpen,
    Target,
    HelpCircle,
    CheckSquare,
    Clock
} from 'lucide-react';
import { useRouter } from 'next/router';
import { getNotes, deleteNote as apiDeleteNote } from '../../services/note.service.js';


const StudyNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getNotes();
            setNotes(data.notes || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch notes');
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    const stripMarkdown = (text) => {
        return text
            .replace(/[*_~`]/g, '') // Remove basic markdown characters
            .replace(/#+\s/g, '')   // Remove headers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Convert links to text
    };

    const handleViewNote = (noteId) => {
        router.push(`/study-notes/${noteId}`);
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await apiDeleteNote(noteId);
            setNotes(notes.filter(note => note._id !== noteId));
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeIcon = (inputType) => {
        switch (inputType) {
            case 'pdf':
                return <FileText className="type-icon pdf" size={16} />;
            case 'text':
                return <BookOpen className="type-icon text" size={16} />;
            default:
                return <FileText className="type-icon" size={16} />;
        }
    };

    const getAIContentStats = (aiOutputs) => {
        if (!aiOutputs) return null;
        return {
            hasFlashcards: aiOutputs.flashcards?.length > 0,
            hasQuizzes: aiOutputs.quizQuestions?.length > 0,
            hasActionItems: aiOutputs.actionItems?.length > 0,
            flashcardCount: aiOutputs.flashcards?.length || 0,
            quizCount: aiOutputs.quizQuestions?.length || 0,
            actionItemCount: aiOutputs.actionItems?.length || 0
        };
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (note.aiOutputs?.summary || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="study-notes-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your study notes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="study-notes-container">
                <div className="error-state">
                    <FileText size={48} className="error-icon" />
                    <h3>Error Loading Notes</h3>
                    <p>{error}</p>
                    <button onClick={fetchNotes} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="study-notes-container">
            <div className="study-notes-header">
                <div className="header-content">
                    <h1>Study Notes</h1>
                    <p>Manage and review your AI-processed study materials</p>
                </div>
            </div>

            <div className="controls-section">
                <div className="search-box">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="notes-stats">
                <div className="stat-item">
                    <FileText size={20} />
                    <span>{filteredNotes.length} Notes</span>
                </div>
            </div>

            {filteredNotes.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={64} className="empty-icon" />
                    <h3>No Study Notes Found</h3>
                    <p>No notes match your current search.</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {filteredNotes.map((note) => {
                        const aiStats = getAIContentStats(note.aiOutputs);
                        return (
                            <div key={note._id} className="note-card" onClick={() => handleViewNote(note._id)}>
                                <div className="note-header">
                                    <div className="note-title-section">
                                        {getTypeIcon(note.inputType)}
                                        <h3 className="note-title">{note.title}</h3>
                                    </div>
                                    <div className="note-actions">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                handleViewNote(note._id);
                                            }}
                                            className="action-button view"
                                            title="View Note"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                handleDeleteNote(note._id);
                                            }}
                                            className="action-button delete"
                                            title="Delete Note"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="note-content">
                                    {note.aiOutputs?.summary && (
                                        <div className="summary-preview">
                                            <p>{stripMarkdown(note.aiOutputs.summary).substring(0, 150)}...</p>
                                        </div>
                                    )}
                                </div>

                                {aiStats && (
                                    <div className="ai-content-indicators">
                                        {aiStats.hasFlashcards && (
                                            <div className="indicator flashcards">
                                                <Target size={14} />
                                                <span>{aiStats.flashcardCount} Flashcards</span>
                                            </div>
                                        )}
                                        {aiStats.hasQuizzes && (
                                            <div className="indicator quizzes">
                                                <HelpCircle size={14} />
                                                <span>{aiStats.quizCount} Quiz Questions</span>
                                            </div>
                                        )}
                                        {aiStats.hasActionItems && (
                                            <div className="indicator action-items">
                                                <CheckSquare size={14} />
                                                <span>{aiStats.actionItemCount} Action Items</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="note-footer">
                                    <div className="note-meta">
                                        <Clock size={14} />
                                        <span>{formatDate(note.createdAt)}</span>
                                    </div>
                                    <div className="processing-status">
                                        <div className={`status-indicator ${note.metadata?.status || 'processed'}`}>
                                            {note.metadata?.status === 'processing' ? 'Processing...' : 'Ready'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudyNotes;
