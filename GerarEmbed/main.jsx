// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import NotFoundPage from './NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LogProvider } from './context/LogContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter basename="/DashBoard/">
            <AuthProvider>
                <LogProvider>
                    <ToastProvider>
                        <Routes>
                            <Route path="/" element={<App />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </ToastProvider>
                </LogProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);