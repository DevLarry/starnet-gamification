import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Header from './components/Layout/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Notification from './components/Common/Notification';
import './App.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl =
  'https://raw.githubusercontent.com/nuex001/Tonkeepermanifest/main/tonconnect-manifest.json';

function App() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <AuthProvider>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Router>
          <div className="App">
            <Header />

            <main className="main-content">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </main>

            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={hideNotification}
              />
            )}
          </div>
        </Router>
      </TonConnectUIProvider>
    </AuthProvider>
  );
}

export default App;
