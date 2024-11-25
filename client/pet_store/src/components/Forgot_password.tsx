import React, { useState } from 'react';
import axios from 'axios';
import '../css/forgot_password.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await axios.post('http://localhost:5000/api/reset_password', { 
                email 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setMessage(response.data.message);
            setEmail(''); // Clear the form after successful submission
        } catch (err: any) {
            console.error("Password reset error:", err);
            setError(err.response?.data?.error || 'An error occurred while processing your request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="form-container">
                <h2>Email Verification</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={isLoading ? 'loading' : ''}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    
                    {error && <div className="error-message" role="alert">{error}</div>}
                    {message && <div className="success-message" role="alert">{message}</div>}
                    
                    <div className="login-link">
                        Return to <a href="/login">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;