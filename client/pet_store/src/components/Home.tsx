// src/components/Home.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || { username: null };  // Get the username from the login page

    const handleLogout = () => {
        navigate('/login');  // Redirect to login page on logout
    };

    return (
        <div>
            {/* Navigation Bar */}
            <nav style={styles.navbar}>
                <div>
                    <span>Welcome, {username}</span>
                </div>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </nav>

            {/* Main content */}
            <div style={styles.content}>
                <h1>Home Page</h1>
                <p>This is the home page after successful login.</p>
            </div>
        </div>
    );
};

// Basic styles for the navigation bar
const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#333',
        color: '#fff',
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        color: '#fff',
    },
    content: {
        padding: '20px',
    }
};

export default Home;
