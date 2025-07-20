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
  display: flex;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ViewPollHistoryButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const RightPanel = styled.div`
  width: 350px;
  background: white;
  padding: 30px;
  border-left: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  background: #f0f2f5;
  border-radius: 10px;
  padding: 5px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => (props.active ? 'white' : 'transparent')};
  color: ${props => (props.active ? '#333' : '#666')};
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: ${props => (props.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none')};
`;

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 380px; /* RightPanel width + some padding */
  background: #667eea;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 2rem;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

function TeacherDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activePoll, pollHistory } = useSelector((state) => state.poll);
  const [activeView, setActiveView] = useState('create'); // create, results, history
  const [rightPanelTab, setRightPanelTab] = useState('chat'); // chat, participants

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderMainContent = () => {
    if (activePoll) {
      return <PollResults />;
    }
    if (activeView === 'history') {
      return <PollHistory />;
    }
    return <CreatePoll />;
  };

  return (
    <DashboardContainer>
      <MainContent>
        <Header>
          <Title>
            {activeView === 'history' ? 'Poll History' : "Let's Get Started"}
          </Title>
          <HeaderActions>
            <ViewPollHistoryButton onClick={() => setActiveView(activeView === 'history' ? 'create' : 'history')}>
              {activeView === 'history' ? 'Create Poll' : 'View Poll History'}
            </ViewPollHistoryButton>
          </HeaderActions>
        </Header>
        {renderMainContent()}
      </MainContent>
      <RightPanel>
        <TabContainer>
          <Tab active={rightPanelTab === 'chat'} onClick={() => setRightPanelTab('chat')}>
            Chat
          </Tab>
          <Tab active={rightPanelTab === 'participants'} onClick={() => setRightPanelTab('participants')}>
            Participants
          </Tab>
        </TabContainer>
        {rightPanelTab === 'chat' && <Chat />}
        {rightPanelTab === 'participants' && <UserList onKickUser={(userId) => socketService.kickStudent(userId)} />}
      </RightPanel>
      <FloatingActionButton onClick={() => console.log('Open Chat')}>
        💬
      </FloatingActionButton>
    </DashboardContainer>
  );
}

export default TeacherDashboard; 