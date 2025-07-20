import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const ResultsContainer = styled.div`
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

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ResultOption = styled.div`
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #dcdfe2;
  width: ${props => props.percentage}%;
  transition: width 0.5s ease-in-out;
  z-index: 1;
`;

const OptionContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AskNewQuestionButton = styled.button`
  width: 100%;
  background: #667eea;
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 30px;
`;

function PollResults() {
  const { activePoll } = useSelector((state) => state.poll);

  if (!activePoll) {
    return <div>No active poll.</div>;
  }

  const totalVotes = activePoll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <ResultsContainer>
      <Header>
        <QuestionInfo>Question 1</QuestionInfo>
        <Timer>00:15</Timer>
      </Header>
      <Question>{activePoll.question}</Question>
      <ResultsList>
        {activePoll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <ResultOption key={index}>
              <ProgressBar percentage={percentage} />
              <OptionContent>
                <span>{option.text}</span>
                <span>{percentage.toFixed(0)}%</span>
              </OptionContent>
            </ResultOption>
          );
        })}
      </ResultsList>
      <AskNewQuestionButton>Ask a new question</AskNewQuestionButton>
    </ResultsContainer>
  );
}

export default PollResults; 