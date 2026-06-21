import React, { useState } from 'react';
import { Brain, Search, Bell, Menu, X, Settings as SettingsIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { UserButton } from '@clerk/nextjs';
// import '../../styles/Header.css';

function AuthHeader({ isSidebarOpen, setIsSidebarOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleHeader = () => router.push('/');

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="Settings"
                                    labelIcon={<SettingsIcon size={16} />}
                                    href="/settings"
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </span>
                </div>
            </nav>
        </header>
    );
}
export default AuthHeader;
