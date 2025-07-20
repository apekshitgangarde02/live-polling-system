import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../store/slices/authSlice';
import socketService from '../services/socketService';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';
import UserList from './UserList';
import Chat from './Chat';
import PollHistory from './PollHistory';

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

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? '#667eea' : 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#667eea' : 'rgba(102, 126, 234, 0.2)'};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#27ae60' : '#e74c3c'};
`;

function TeacherDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activePoll, pollHistory } = useSelector((state) => state.poll);
  const { connectedUsers } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('create');
  const [showChat, setShowChat] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const students = connectedUsers.filter(user => user.role === 'student');
  const teachers = connectedUsers.filter(user => user.role === 'teacher');

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>Teacher Dashboard</Title>
          <StatusIndicator>
            <StatusDot connected={true} />
            {students.length} Students Connected
          </StatusIndicator>
        </div>
        <UserInfo>
          <UserName>Welcome, {user?.name}</UserName>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <LeftPanel>
          <Card>
            <TabContainer>
              <Tab 
                active={activeTab === 'create'} 
                onClick={() => setActiveTab('create')}
              >
                Create Poll
              </Tab>
              <Tab 
                active={activeTab === 'results'} 
                onClick={() => setActiveTab('results')}
              >
                Live Results
              </Tab>
              <Tab 
                active={activeTab === 'history'} 
                onClick={() => setActiveTab('history')}
              >
                Poll History
              </Tab>
            </TabContainer>

            {activeTab === 'create' && <CreatePoll />}
            {activeTab === 'results' && <PollResults />}
            {activeTab === 'history' && <PollHistory />}
          </Card>
        </LeftPanel>

        <RightPanel>
          <Card>
            <UserList 
              users={connectedUsers}
              onKickUser={(userId) => socketService.kickStudent(userId)}
            />
          </Card>

          <Card>
            <Chat 
              isOpen={showChat}
              onToggle={() => setShowChat(!showChat)}
            />
          </Card>
        </RightPanel>
      </MainContent>
    </DashboardContainer>
  );
}

export default TeacherDashboard; 