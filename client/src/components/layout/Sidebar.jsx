import React, { useState } from 'react';
import { 
    Home, 
    Zap, 
    Search, 
    FileText, 
    Music, 
    Video, 
    Edit3,
    Clipboard,
    Target,
    HelpCircle,
    BarChart3,
    Settings,
    CreditCard,
    Brain
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path;

    const navigationSections = [
        {
            title: "Workspace",
            items: [
                { icon: Home, label: "Dashboard", path: "/dashboard" },
                { icon: Zap, label: "Quick Upload", path: "/upload" },
                { icon: Search, label: "Search", path: "/search" }
            ]
        },
        {
            title: "Content",
            items: [
                { icon: FileText, label: "Documents", path: "/documents" },
                { icon: Music, label: "Audio Files", path: "/audio" },
                { icon: Video, label: "Meeting Transcripts", path: "/transcripts" },
                { icon: Edit3, label: "Raw Notes", path: "/notes" }
            ]
        },
        {
            title: "AI Generated",
            items: [
                { icon: Clipboard, label: "Study Notes", path: "/study-notes" },
                { icon: Target, label: "Flashcards", path: "/flashcards" },
                { icon: HelpCircle, label: "Quiz Questions", path: "/quizzes" },
                { icon: BarChart3, label: "Summaries", path: "/summaries" }
            ]
        },
        {
            title: "Account",
            items: [
                { icon: Settings, label: "Settings", path: "/settings" },
                { icon: CreditCard, label: "Billing", path: "/billing" }
            ]
        }
    ];

    return (
        <aside className="sidebar">

            <nav className="sidebar-nav">
                {navigationSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="nav-section">
                        <div className="nav-title">{section.title}</div>
                        {section.items.map((item, itemIndex) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={itemIndex}
                                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => navigate(item.path)}
                                >
                                    <IconComponent className="nav-icon" size={18} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;