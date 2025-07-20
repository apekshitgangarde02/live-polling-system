import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { initializeAuth } from './store/slices/authSlice';
import socketService from './services/socketService';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  font-size: 1.2rem;
`;

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const { error } = useSelector((state) => state.poll);

  useEffect(() => {
    // Initialize authentication from localStorage
    dispatch(initializeAuth());
    
    // Connect to socket server
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.join(user);
    }
  }, [isAuthenticated, user]);

  // Show error message if any
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleLogin = (loginData) => {
    dispatch(initializeAuth(loginData)); // Simplified login
  };

  if (!isAuthenticated) {
    return (
      <AppContainer>
        <GlobalStyles />
        <Login onLogin={handleLogin} />
      </AppContainer>
    );
  }

  // If authenticated but role is not yet assigned, show a loading state
  if (!role) {
    return (
      <AppContainer>
        <GlobalStyles />
        <LoadingContainer>
          <p>Assigning role, please wait...</p>
        </LoadingContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route 
            path="/teacher" 
            element={role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/student" />} 
          />
          <Route 
            path="/student" 
            element={role === 'student' ? <StudentDashboard /> : <Navigate to="/teacher" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={role === 'teacher' ? '/teacher' : '/student'} />} 
          />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App; 