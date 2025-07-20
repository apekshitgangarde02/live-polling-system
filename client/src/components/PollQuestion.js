import React, { useState } from 'react';
import styled from 'styled-components';
import socketService from '../services/socketService';

const QuestionContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const Question = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  line-height: 1.4;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
`;

const OptionButton = styled.button`
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 2px solid ${props => props.selected ? 'transparent' : '#e1e5e9'};
  padding: 20px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.selected ? 'transparent' : '#667eea'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 0.1;
  }
`;

const OptionText = styled.span`
  display: block;
  margin-bottom: 5px;
`;

const OptionLetter = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  background: ${props => props.selected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.selected ? 'white' : '#667eea'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 15px;
  float: left;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  padding: 15px 40px;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 30px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(39, 174, 96, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Instructions = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 15px;
`;

function PollQuestion({ poll }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedOption === null) {
      setError('Please select an option');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      socketService.submitAnswer({ optionIndex: selectedOption });
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D, etc.
  };

  return (
    <QuestionContainer>
      <Question>{poll.question}</Question>
      <Instructions>
        Please select your answer from the options below. You have one chance to submit your response.
      </Instructions>

      <OptionsContainer>
        {poll.options.map((option, index) => (
          <OptionButton
            key={index}
            selected={selectedOption === index}
            onClick={() => handleOptionSelect(index)}
            disabled={isSubmitting}
          >
            <OptionLetter selected={selectedOption === index}>
              {getOptionLetter(index)}
            </OptionLetter>
            <OptionText>{option.text}</OptionText>
          </OptionButton>
        ))}
      </OptionsContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SubmitButton
        onClick={handleSubmit}
        disabled={selectedOption === null || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
      </SubmitButton>
    </QuestionContainer>
  );
}

export default PollQuestion; 