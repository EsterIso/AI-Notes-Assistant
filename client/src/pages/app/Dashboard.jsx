import React from "react";
import { FileText, Clipboard, HelpCircle, Plus, Upload, Loader } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import useNotes from '../../hooks/useNotes';
import ReactMarkdown from 'react-markdown';
import "../../styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();
  const {
    loading,
    stats,
    recentNotes,
    handleCreateNoteFromFile
  } = useNotes();

  const handleNewTextNote = () => {
    // Navigate to create note page
    navigate('/notes/create');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    try {
      await handleCreateNoteFromFile(file);
    } catch (error) {
      // Error handling is done in the hook
      console.error('File upload error:', error);
    }
  };

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  if (loading && recentNotes.length === 0) {
    return (
      <div className="dashboard loading">
        <Loader className="spinner" size={48} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statsData = [
    { label: "Notes", value: stats.notes, icon: FileText },
    { label: "Flashcards", value: stats.flashcards, icon: Clipboard },
    { label: "Quizzes", value: stats.quizzes, icon: HelpCircle },
  ];

  return (
    <div className="dashboard">
      {/* Stats Section */}
      <div className="stats-grid">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <Icon size={24} />
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        
        <button className="action-btn" onClick={handleNewTextNote}>
          <Plus size={18} /> New Note
        </button>
        
        <label className="action-btn" style={{ cursor: "pointer" }}>
          {loading ? (
            <>
              <Loader className="spinner" size={18} />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={18} /> Upload File
            </>
          )}
          <input
            type="file"
            style={{ display: "none" }}
            accept=".pdf"
            disabled={loading}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                handleFileUpload(file);
                e.target.value = '';
              }
            }}
          />
        </label>
      </div>

      {/* Recent Notes */}
      <div className="recent-notes">
        <h2>Recent Notes</h2>
        {recentNotes.length === 0 ? (
          <p className="no-notes">No notes yet. Create your first note!</p>
        ) : (
          recentNotes.map((note) => (
            <div 
              key={note.id} 
              className={`note-card ${note.status}`}
              onClick={() => handleNoteClick(note.id)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{note.title}</h3>
              <p className="note-summary"><ReactMarkdown>{note.summary}</ReactMarkdown></p>
              <div className="note-footer">
                <span className="note-date">{note.date}</span>
                {note.status === 'processing' && (
                  <span className="status-badge processing">Processing...</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;