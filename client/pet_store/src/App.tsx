// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResetPassword from './components/Reset_password';
import Home from './components/Home';
import SignupLogin from './components/SigupLogin';


const App: React.FC = () => {
  console.log('App.tsx is rendering');
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignupLogin />} />
                <Route path="/login" element={<SignupLogin />} />
                <Route path="/reset_password" element={<ResetPassword />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
