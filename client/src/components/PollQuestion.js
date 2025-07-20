import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

const PollContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const QuestionInfo = styled.div`
  font-size: 1rem;
  color: #666;
`;

const Timer = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #e74c3c;
`;

const Question = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  gap: 15px;
  background: ${props => (props.selected ? '#e8eaf6' : '#f8f9fa')};
  border: 1px solid ${props => (props.selected ? '#667eea' : '#e1e5e9')};
  padding: 15px;
  border-radius: 10px;
  font-size: 1rem;
  text-align: left;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #667eea;
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 30px;
`;

function PollQuestion() {
  const { activePoll } = useSelector((state) => state.poll);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (activePoll) {
      const remaining = Math.round((activePoll.endTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);

      const interval = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activePoll]);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      socketService.submitAnswer({ optionIndex: selectedOption });
    }
  };

  if (!activePoll) return null;

  return (
    <PollContainer>
      <Header>
        <QuestionInfo>Question 1</QuestionInfo>
        <Timer>{timeLeft}s</Timer>
      </Header>
      <Question>{activePoll.question}</Question>
      <OptionsGrid>
        {activePoll.options.map((option, index) => (
          <Option
            key={index}
            selected={selectedOption === index}
            onClick={() => setSelectedOption(index)}
          >
            <input
              type="radio"
              name="poll-option"
              checked={selectedOption === index}
              readOnly
            />
            {option.text}
          </Option>
        ))}
      </OptionsGrid>
      <SubmitButton onClick={handleSubmit} disabled={selectedOption === null}>
        Submit
      </SubmitButton>
    </PollContainer>
  );
}

export default PollQuestion; 