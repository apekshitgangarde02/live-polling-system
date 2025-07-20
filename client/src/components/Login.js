import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { setName, setRole } from '../store/slices/authSlice';
import { v4 as uuidv4 } from 'uuid';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
  max-width: 400px;
  text-align: center;
`;

const RoleSelector = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const RoleCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  width: 250px;
  text-align: left;
  cursor: pointer;
  border: 2px solid ${props => (props.selected ? '#667eea' : '#e1e5e9')};
  box-shadow: ${props =>
    props.selected ? '0 10px 20px rgba(102, 126, 234, 0.2)' : '0 5px 15px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
  }
`;

const RoleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const RoleDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

const ContinueButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 40px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NameInputContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const NameInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  text-align: center;
`;

const Login = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setNameState] = useState('');
  const dispatch = useDispatch();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setStep(2);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim() && selectedRole) {
      const tabId = sessionStorage.getItem('tabId') || uuidv4();
      sessionStorage.setItem('tabId', tabId);
      
      dispatch(setName(name));
      dispatch(setRole(selectedRole));

      onLogin({ name, role: selectedRole, tabId });
    }
  };

  if (step === 2) {
    return (
      <LoginContainer>
        <Title>Let's Get Started</Title>
        <Subtitle>
          {selectedRole === 'student'
            ? "If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates."
            : "You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time."}
        </Subtitle>
        <form onSubmit={handleLogin}>
          <NameInputContainer>
            <NameInput
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setNameState(e.target.value)}
              required
            />
            <ContinueButton type="submit">Continue</ContinueButton>
          </NameInputContainer>
        </form>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <Title>Welcome to the Live Polling System</Title>
      <Subtitle>Please select the role that best describes you to begin using the live polling system.</Subtitle>
      <RoleSelector>
        <RoleCard selected={selectedRole === 'teacher'} onClick={() => handleRoleSelect('teacher')}>
          <RoleTitle>I'm a Teacher</RoleTitle>
          <RoleDescription>Lorem ipsum is simply dummy text of the printing and typesetting industry.</RoleDescription>
        </RoleCard>
        <RoleCard selected={selectedRole === 'student'} onClick={() => handleRoleSelect('student')}>
          <RoleTitle>I'm a Student</RoleTitle>
          <RoleDescription>Submit answers and view live poll results in real-time.</RoleDescription>
        </RoleCard>
      </RoleSelector>
      <ContinueButton onClick={handleContinue} disabled={!selectedRole}>
        Continue
      </ContinueButton>
    </LoginContainer>
  );
};

export default Login; 