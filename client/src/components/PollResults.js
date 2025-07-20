import React from 'react';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  padding: 20px;
`;

const Question = styled.h2`
  color: #333;
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
  line-height: 1.4;
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
`;

const ResultItem = styled.div`
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const OptionText = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const VoteCount = styled.span`
  font-weight: 700;
  color: #667eea;
  font-size: 1.2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f1f3f4;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
  width: ${props => props.percentage}%;
`;

const Percentage = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const TotalVotes = styled.div`
  text-align: center;
  margin-top: 25px;
  padding: 15px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.status === 'ended' ? '#e74c3c' : '#27ae60'};
  color: white;
  margin-bottom: 20px;
`;

const WinnerBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f39c12;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

function PollResults({ poll }) {
  if (!poll) {
    return (
      <ResultsContainer>
        <NoResults>No poll results to display</NoResults>
      </ResultsContainer>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...poll.options.map(option => option.votes));
  
  // Find winner(s)
  const winners = poll.options
    .map((option, index) => ({ ...option, index }))
    .filter(option => option.votes === maxVotes && maxVotes > 0);

  return (
    <ResultsContainer>
      <StatusBadge status={poll.status}>
        {poll.status === 'ended' ? 'Poll Ended' : 'Live Results'}
      </StatusBadge>
      
      <Question>{poll.question}</Question>

      <ResultsList>
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isWinner = winners.some(winner => winner.index === index);

          return (
            <ResultItem key={index}>
              {isWinner && <WinnerBadge>Winner</WinnerBadge>}
              <OptionHeader>
                <OptionText>
                  {String.fromCharCode(65 + index)}. {option.text}
                </OptionText>
                <VoteCount>{option.votes} votes</VoteCount>
              </OptionHeader>
              <ProgressBar>
                <ProgressFill percentage={percentage} />
              </ProgressBar>
              <Percentage>{percentage}%</Percentage>
            </ResultItem>
          );
        })}
      </ResultsList>

      <TotalVotes>
        Total Votes: {totalVotes}
      </TotalVotes>
    </ResultsContainer>
  );
}

export default PollResults; 