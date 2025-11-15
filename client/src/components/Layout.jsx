import React from 'react';
import { Outlet, Navigate, Link } from 'react-router';
import { useAuthStore } from '../stores/authStore';

const Layout = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const styles = {
        mainContainer: {
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
        },
        header: {
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        headerContent: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        logo: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#4f46e5',
            textDecoration: 'none',
        },
        nav: {
            display: 'flex',
            gap: '16px',
        },
        navLink: {
            color: '#4b5563',
            textDecoration: 'none',
            transition: 'color 0.2s',
        },
        navLinkHover: {
            color: '#4f46e5',
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        userName: {
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: '500',
        },
        logoutButton: {
            fontSize: '0.875rem',
            padding: '4px 12px',
            border: '1px solid transparent',
            borderRadius: '6px',
            color: 'white',
            backgroundColor: '#ef4444',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        logoutButtonHover: {
            backgroundColor: '#dc2626',
        },
        mainContent: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '24px 24px',
        }
    };

    const handleLogoutHover = (e, isHovering) => {
        e.currentTarget.style.backgroundColor = isHovering 
            ? styles.logoutButtonHover.backgroundColor 
            : styles.logoutButton.backgroundColor;
    };

    return (
        <div style={styles.mainContainer}>
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <Link to="/" style={styles.logo}>
                        📚 BookStreak
                    </Link>
                    <nav style={styles.nav}>
                        <Link 
                            to="/" 
                            style={styles.navLink}
                            onMouseOver={e => e.currentTarget.style.color = styles.navLinkHover.color}
                            onMouseOut={e => e.currentTarget.style.color = styles.navLink.color}
                        >Home</Link>
                        <Link 
                            to="/leaderboard" 
                            style={styles.navLink}
                            onMouseOver={e => e.currentTarget.style.color = styles.navLinkHover.color}
                            onMouseOut={e => e.currentTarget.style.color = styles.navLink.color}
                        >Leaderboard</Link>
                        <Link 
                            to="/chat" 
                            style={styles.navLink}
                            onMouseOver={e => e.currentTarget.style.color = styles.navLinkHover.color}
                            onMouseOut={e => e.currentTarget.style.color = styles.navLink.color}
                        >Chat</Link>
                    </nav>
                    <div style={styles.userInfo}>
                        <span style={styles.userName}>
                            Hello, {user?.name || 'Reader'}
                        </span>
                        <button
                            onClick={logout}
                            style={styles.logoutButton}
                            onMouseOver={(e) => handleLogoutHover(e, true)}
                            onMouseOut={(e) => handleLogoutHover(e, false)}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main style={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;