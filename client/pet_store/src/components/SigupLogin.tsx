// src/components/Signup.tsx
import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Signup.css';

const SignupLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check the current path to determine whether we're in login or signup mode
    const isLogin = location.pathname === '/login';

    // This function toggles between /signup and /login
    const toggleLoginSignup = () => {
        if (isLogin) {
            navigate('/signup');
        } else {
            navigate('/login');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', { email, username, password });
            setMessage(response.data.message);
            setError(null);
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.error);
                setMessage(null);
            }
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            setMessage(response.data.message);
            setError(null);

            // Redirect to the home page and pass the username via state
            navigate('/home', { state: { username: response.data.username } });
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.error);
                setMessage(null);
            }
        }
    };

    return (
        <div className={`container ${isLogin ? 'login-active' : ''}`}>
            {/* Left Container for Signup/Login Form */}
            <div className="left-container">
                <div className="form-container">
                    {!isLogin ? (
                        <>
                            <h2>Signup</h2>
                            <form onSubmit={handleSignup}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="submit">Signup</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2>Login</h2>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="submit">Login</button>
                            </form>
                        </>
                    )}
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}
                </div>
            </div>

            {/* Right Container for Background and Transition Button */}
            <div className="right-container">
                <button className="transition-button" onClick={toggleLoginSignup}>
                    {isLogin ? 'Go to Signup' : 'Go to Login'}
                </button>
            </div>
        </div>
    );
};

export default SignupLogin;
