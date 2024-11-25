import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import '../css/reset_password.css'; // Reuse the existing CSS file

const ResetPasswordForm: React.FC = () => {
    const { token } = useParams(); // Get the reset token from the URL
    const navigate = useNavigate(); // Initialize useNavigate for redirection
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            setMessage(null);
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/api/reset/${token}`, {
                new_password: newPassword,
                confirm_password: confirmPassword
            });
            setMessage(response.data.message);
            setError(null);

            // Redirect to the login page after successful password reset
            navigate('/login');
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.error);
                setMessage(null);
            }
        }
    };

    return (
        <div className="reset-password-container">
            <div className="form-container">
                <h2>Reset Your Password</h2>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
            </div>
        </div>
    );
};

export default ResetPasswordForm;
