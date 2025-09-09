import React from "react";
import { FileText, Clipboard, HelpCircle, Plus } from "lucide-react";
import "../../styles/Dashboard.css";

function Dashboard() {
  // These would come from backend (mocked for now)
  const stats = [
    { label: "Notes", value: 12, icon: FileText },
    { label: "Flashcards", value: 85, icon: Clipboard },
    { label: "Quizzes", value: 5, icon: HelpCircle },
  ];

  const recentNotes = [
    { title: "Biology - Cell Division", summary: "Quick breakdown of mitosis stages...", date: "Sep 7" },
    { title: "History - Cold War", summary: "Major events between US & USSR...", date: "Sep 5" },
    { title: "Algorithms Lecture", summary: "Complexity classes and Big-O notes...", date: "Sep 3" },
  ];

  return (
    <div className="dashboard">
      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((stat, idx) => {
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
        <button className="action-btn">
          <Plus size={18} /> New Note
        </button>
        <button className="action-btn">
          <FileText size={18} /> Upload File
        </button>
      </div>

      {/* Recent Notes */}
      <div className="recent-notes">
        <h2>Recent Notes</h2>
        {recentNotes.map((note, idx) => (
          <div key={idx} className="note-card">
            <h3>{note.title}</h3>
            <p className="note-summary">{note.summary}</p>
            <span className="note-date">{note.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
