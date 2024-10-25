// src/components/ResetPassword.tsx
import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/reset_password', { email });
            setMessage(response.data.message);
            setError(null);
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.error);
                setMessage(null);
            }
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
                Return to<a href="/login">Login</a>
            </form>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
        </div>
    );
};

export default ResetPassword;
