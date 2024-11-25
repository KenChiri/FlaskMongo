// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignupLogin from './components/SigupLogin';
import ResetPasswordForm from './components/Reset_password';
import ForgotPassword from './components/Forgot_password';
import ContactForm from './components/ContactForm';


const App: React.FC = () => {
  console.log('App.tsx is rendering');
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignupLogin />} />
                <Route path="/login" element={<SignupLogin />} />
                <Route path="/reset_password" element={<ForgotPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/reset/:token" element={<ResetPasswordForm />} />
                <Route path='/contact' element={<ContactForm />} />
            </Routes>
        </Router>
    );
};

export default App;
