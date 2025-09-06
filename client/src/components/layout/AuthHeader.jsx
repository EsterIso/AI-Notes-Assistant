import React, { useState } from 'react';
import { Brain } from 'lucide-react';
// import DropdownProfile from './SettingsDropdown';
import '../../styles/Header.css';
function AuthHeader() {
    // const [isDropdownOpen, setDropdownOpen] = useState(false)
    const handleHeader = () => {
        navigate('/')
    }
    return ( 
        <header className="header">
        <nav className="nav">
          <div className="logo" onClick={handleHeader}>
            <div className="logo-icon">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="logo-text">StudyAI</span>
          </div>
          <button 
          className="nav-button" 
          aria-label="Sign in"
          >
            Get Started
          </button>
        </nav>
      </header>
    );
}
export default AuthHeader;