import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../store/slices/authSlice';
import { setTimeLeft } from '../store/slices/pollSlice';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import Chat from './Chat';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #555;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #c0392b;
    transform: translateY(-2px);
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  margin-bottom: 20px;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatusCard = styled(Card)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const StatusIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
`;

const StatusText = styled.h2`
  color: #666;
  margin-bottom: 10px;
  font-weight: 600;
`;

const StatusDescription = styled.p`
  color: #888;
  font-size: 1rem;
  line-height: 1.6;
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Timer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 120px;
  text-align: center;
`;

const TimerLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const ChatToggle = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

function StudentDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activePoll, timeLeft, hasAnswered, canAnswer } = useSelector((state) => state.poll);
  const [showChat, setShowChat] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (activePoll && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(setTimeLeft(Math.max(0, timeLeft - 1000)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePoll, timeLeft, dispatch]);

  const formatTime = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMainContent = () => {
    if (!activePoll) {
      return (
        <StatusCard>
          <StatusIcon>📝</StatusIcon>
          <StatusText>Waiting for Poll</StatusText>
          <StatusDescription>
            The teacher will create a new poll soon. Stay tuned!
          </StatusDescription>
        </StatusCard>
      );
    }

    if (activePoll.status === 'ended') {
      return <PollResults poll={activePoll} />;
    }

    if (hasAnswered || !canAnswer) {
      return (
        <div>
          <StatusCard>
            <StatusIcon>✅</StatusIcon>
            <StatusText>Answer Submitted!</StatusText>
            <StatusDescription>
              Your answer has been recorded. Waiting for other students to respond...
            </StatusDescription>
            <TimerContainer>
              <TimerLabel>Time Remaining:</TimerLabel>
              <Timer>{formatTime(timeLeft)}</Timer>
            </TimerContainer>
          </StatusCard>
          <PollResults poll={activePoll} />
        </div>
      );
    }

    return (
      <div>
        <PollQuestion poll={activePoll} />
        <TimerContainer>
          <TimerLabel>Time Remaining:</TimerLabel>
          <Timer>{formatTime(timeLeft)}</Timer>
        </TimerContainer>
      </div>
    );
  };

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>Student Dashboard</Title>
        </div>
        <UserInfo>
          <UserName>Welcome, {user?.name}</UserName>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <LeftPanel>
          <Card>
            {renderMainContent()}
          </Card>
        </LeftPanel>

        <RightPanel>
          <Card>
            <ChatToggle onClick={() => setShowChat(!showChat)}>
              {showChat ? 'Close Chat' : 'Open Chat'}
            </ChatToggle>
            {showChat && (
              <Chat 
                isOpen={showChat}
                onToggle={() => setShowChat(!showChat)}
              />
            )}
          </Card>
        </RightPanel>
      </MainContent>
    </DashboardContainer>
  );
}

export default StudentDashboard; 