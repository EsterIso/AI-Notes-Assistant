import React, { useState, useEffect } from 'react';
import { Brain, UserRound, Search, Bell, Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';
import DropdownProfile from './SettingsDropdown';
// import '../../styles/Header.css';

function AuthHeader({ isSidebarOpen, setIsSidebarOpen }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleHeader = () => router.push('/');

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]);

    return ( 
        <header className="header">
            <nav className="nav">
                <button 
                    className="mobile-toggle"
                    onClick={handleToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className="logo" onClick={handleHeader}>
                    <div className="logo-icon">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="logo-text">StudyAI</span>
                </div>
            
                <div className="search-container">
                    <Search className="search-icon" size={16} />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search files, notes, or flashcards..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                
                <div className="header-actions">
                    <button className="action-btn">
                        <Bell size={18} />
                    </button>
                    
                    <span className='dropdown-container'>
                        <div 
                            className="user-avatar" 
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                        >
                            <UserRound size={18} />
                        </div>
                        {isDropdownOpen && <DropdownProfile />}
                    </span>
                </div>
            </nav>
        </header>
    );
}
export default AuthHeader;
