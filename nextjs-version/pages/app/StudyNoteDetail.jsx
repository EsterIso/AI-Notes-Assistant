import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
    ArrowLeft, 
    FileText, 
    BookOpen,
    Clock,
    RotateCcw,
    Trash2,
    Copy,
    Check,
    Target,
    HelpCircle,
    CheckSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getNoteById, deleteNote as apiDeleteNote } from '../../services/note.service.js';
import Flashcard from '../../components/layout/Flashcard';
import Quiz from '../../components/layout/Quiz';

const StudyNoteDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');
    const [copiedStates, setCopiedStates] = useState({});

    useEffect(() => {
        if (id) {  // Only fetch when id is available
            fetchNote();
        }
    }, [id]);

    const fetchNote = async () => {
        if (!id) return; // Don't fetch if no id
        try {
            setLoading(true);
            setError(null);
            const data = await getNoteById(id);
            setNote(data.note); // make sure your service returns { note: {...} }
        } catch (err) {
            setError(err.message || 'Failed to fetch note');
            console.error('Error fetching note:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await apiDeleteNote(id);
            router.push('/study-notes');
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note');
        }
    };

    // Copy helper
    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedStates(prev => ({ ...prev, [type]: true }));
            setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const getTypeIcon = (inputType) => {
        switch(inputType) {
            case 'pdf': return <FileText className="type-icon pdf" size={20} />;
            case 'docx': return <FileText className="type-icon docx" size={20} />;
            case 'text': return <BookOpen className="type-icon text" size={20} />;
            default: return <FileText className="type-icon" size={20} />;
        }
    };

    if (loading) return <p>Loading note...</p>;
    if (error || !note) return <p>Error loading note: {error}</p>;

    const { aiOutputs } = note;

    return (
        <div className="note-detail-container">
            <div className="note-detail-header">
                <button onClick={() => router.push('/study-notes')} className="back-button">
                    <ArrowLeft size={20} /> Back
                </button>
                <h1>{note.title}</h1>
                <div>
                    <Clock size={16} /> Created {formatDate(note.createdAt)}
                </div>
                <div className="header-actions">
                    <button onClick={handleDelete} className="action-button delete">
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>

            <div className="content-tabs">
                <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>
                    <BookOpen size={16} /> Summary
                </button>
                <button className={activeTab === 'flashcards' ? 'active' : ''} onClick={() => setActiveTab('flashcards')}>
                    <Target size={16} /> Flashcards ({aiOutputs?.flashcards?.length || 0})
                </button>
                <button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => setActiveTab('quiz')}>
                    <HelpCircle size={16} /> Quiz ({aiOutputs?.quizQuestions?.length || 0})
                </button>
                <button className={activeTab === 'actions' ? 'active' : ''} onClick={() => setActiveTab('actions')}>
                    <CheckSquare size={16} /> Actions ({aiOutputs?.actionItems?.length || 0})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'summary' && (
                    <div>
                        <h3>Summary</h3>
                        <button onClick={() => copyToClipboard(aiOutputs?.summary || '', 'summary')}>
                            {copiedStates.summary ? <Check /> : <Copy />} {copiedStates.summary ? 'Copied' : 'Copy'}
                        </button>
                        <div className="summary-content">
                            <ReactMarkdown>
                                {aiOutputs?.summary || 'No summary available'}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {activeTab === 'flashcards' && (
                    <div>
                        {aiOutputs?.flashcards?.length ? (
                            <Flashcard cards={aiOutputs.flashcards} />
                        ) : (
                            <p>No flashcards available</p>
                        )}
                    </div>
                )}

                {activeTab === 'quiz' && (
                    <Quiz questions={aiOutputs?.quizQuestions} />
                )}

                {activeTab === 'actions' && (
                    <div>
                        {aiOutputs?.actionItems?.length ? aiOutputs.actionItems.map((item, i) => (
                            <div key={i}><CheckSquare /> {item}</div>
                        )) : <p>No action items available</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyNoteDetail;
