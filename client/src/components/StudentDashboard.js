import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../store/slices/authSlice';
import { setTimeLeft } from '../store/slices/pollSlice';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import Chat from './Chat';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px;
`;

const WaitingContainer = styled.div`
  text-align: center;
  color: #666;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FloatingChatButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
`;

function StudentDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activePoll, hasAnswered, canAnswer } = useSelector((state) => state.poll);
  const [isChatOpen, setChatOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderContent = () => {
    if (!activePoll) {
      return (
        <WaitingContainer>
          <LoadingSpinner />
          <h2>Waiting for the teacher to ask questions...</h2>
        </WaitingContainer>
      );
    }

    if (activePoll.status === 'ended' || hasAnswered || !canAnswer) {
      return <PollResults />;
    }

    return <PollQuestion />;
  };

  return (
    <DashboardContainer>
      {renderContent()}
      <FloatingChatButton onClick={() => setChatOpen(!isChatOpen)}>
        💬
      </FloatingChatButton>
      {isChatOpen && <Chat />}
    </DashboardContainer>
  );
}

export default StudentDashboard; 