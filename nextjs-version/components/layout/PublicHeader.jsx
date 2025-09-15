import React from 'react';
import {Brain} from 'lucide-react';
import { useRouter } from 'next/router';


function PublicHeader() {

    const router = useRouter();
    const handleHeader = () => {
        router.push('/')
    }
    const handleLogin = () => {
        router.push('/login')
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
          <button 
          className="nav-button" 
          onClick={handleLogin}
          aria-label="Sign in"
          >
            Get Started
          </button>
        </nav>
      </header>
    );
}

export default PublicHeader;