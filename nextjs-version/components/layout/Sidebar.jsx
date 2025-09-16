import React, { useEffect } from 'react';
import { 
    Home, Zap, Search, FileText, Music, Video, Edit3,
    Clipboard, Target, HelpCircle, BarChart3, Settings,
    CreditCard, X
} from 'lucide-react';
import { useRouter } from 'next/router';
function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const router = useRouter();
    const location = useRouter(router.pathname);

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        router.push(path);
        // Only close sidebar on mobile
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    // Handle window resize to ensure proper sidebar behavior
    useEffect(() => {
        const handleResize = () => {
            // On desktop, ensure sidebar is always considered "open"
            if (window.innerWidth > 768) {
                setIsSidebarOpen(true);
            }
        };

        // Set initial state
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsSidebarOpen]);

    // Close sidebar when clicking outside (mobile only)
    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Only handle outside clicks on mobile
            if (window.innerWidth <= 768 && isSidebarOpen) {
                const sidebar = document.querySelector('.sidebar');
                const mobileToggle = document.querySelector('.mobile-toggle');
                
                // Check if click is outside sidebar and not on the toggle button
                if (sidebar && !sidebar.contains(event.target) && 
                    mobileToggle && !mobileToggle.contains(event.target)) {
                    setIsSidebarOpen(false);
                }
            }
        };

        // Add event listener with capture to catch events before they bubble
        document.addEventListener('click', handleOutsideClick, true);
        return () => document.removeEventListener('click', handleOutsideClick, true);
    }, [isSidebarOpen, setIsSidebarOpen]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (window.innerWidth <= 768) {
            if (isSidebarOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }

        // Cleanup
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    const navigationSections = [
        {
            title: "Workspace",
            items: [
                { icon: Home, label: "Dashboard", path: "/" },
            ]
        },
        {
            title: "Content",
            items: [
                { icon: FileText, label: "Documents", path: "/documents" },
            ]
        },
        {
            title: "AI Generated",
            items: [
                { icon: Clipboard, label: "Study Notes", path: "/study-notes" },
            ]
        },
        {
            title: "Account",
            items: [
                { icon: Settings, label: "Settings", path: "/settings" },
            ]
        }
    ];

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
                                    onClick={() => handleNavigation(item.path)}
                                    type="button"
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