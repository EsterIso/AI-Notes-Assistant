import React, { useState } from 'react';
import { Brain, UserRound, Search, Bell, Lightbulb } from 'lucide-react';
import DropdownProfile from './SettingsDropdown';
import '../../styles/Header.css';
function AuthHeader() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleHeader = () => {
        navigate('/')
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // Add search functionality here
    };
    
    return ( 
        <header className="header">
        <nav className="nav">
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
              <button className="action-btn">
                  <Lightbulb size={18} />
              </button>
              
              <span className='dropdown-container'>
                  <div className="user-avatar" onClick={() => {setDropdownOpen(!isDropdownOpen)}}>
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