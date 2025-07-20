import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h3`
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 500px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const HistoryQuestion = styled.h4`
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
  margin-right: 15px;
`;

const HistoryMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;

const HistoryDate = styled.span`
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
`;

const TotalVotes = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ResultsSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const ResultChip = styled.div`
  background: ${props => props.isWinner ? 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' : '#f8f9fa'};
  color: ${props => props.isWinner ? 'white' : '#666'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const WinnerIcon = styled.span`
  font-size: 0.7rem;
`;

const NoHistory = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1rem;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.9rem;
`;

const ExpandedResults = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e1e5e9;
`;

const DetailedResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;

  &:last-child {
    border-bottom: none;
  }
`;

const OptionText = styled.span`
  font-weight: 500;
  color: #333;
`;

const VoteDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VoteCount = styled.span`
  font-weight: 600;
  color: #667eea;
`;

const VotePercentage = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

function PollHistory() {
  const [pollHistory, setPollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPoll, setExpandedPoll] = useState(null);

  useEffect(() => {
    fetchPollHistory();
  }, []);

  const fetchPollHistory = async () => {
    try {
      const response = await fetch('/api/polls/history');
      const data = await response.json();
      setPollHistory(data);
    } catch (error) {
      console.error('Failed to fetch poll history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWinners = (poll) => {
    const maxVotes = Math.max(...poll.options.map(option => option.votes));
    return poll.options
      .map((option, index) => ({ ...option, index }))
      .filter(option => option.votes === maxVotes && maxVotes > 0);
  };

  const toggleExpanded = (pollId) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  if (loading) {
    return (
      <Container>
        <Title>Poll History</Title>
        <LoadingText>Loading poll history...</LoadingText>
      </Container>
    );
  }

  if (pollHistory.length === 0) {
    return (
      <Container>
        <Title>Poll History</Title>
        <NoHistory>No polls have been conducted yet.</NoHistory>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Poll History ({pollHistory.length})</Title>
      
      <HistoryList>
        {pollHistory.map((poll) => {
          const winners = getWinners(poll);
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
          const isExpanded = expandedPoll === poll.id;

          return (
            <HistoryItem key={poll.id} onClick={() => toggleExpanded(poll.id)}>
              <HistoryHeader>
                <HistoryQuestion>{poll.question}</HistoryQuestion>
                <HistoryMeta>
                  <HistoryDate>{formatDate(poll.timestamp)}</HistoryDate>
                  <TotalVotes>{totalVotes} votes</TotalVotes>
                </HistoryMeta>
              </HistoryHeader>

              <ResultsSummary>
                {poll.options.map((option, index) => {
                  const isWinner = winners.some(winner => winner.index === index);
                  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                  
                  return (
                    <ResultChip key={index} isWinner={isWinner}>
                      {isWinner && <WinnerIcon>👑</WinnerIcon>}
                      {String.fromCharCode(65 + index)}: {option.votes} ({percentage}%)
                    </ResultChip>
                  );
                })}
              </ResultsSummary>

              {isExpanded && (
                <ExpandedResults>
                  {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    
                    return (
                      <DetailedResult key={index}>
                        <OptionText>
                          {String.fromCharCode(65 + index)}. {option.text}
                        </OptionText>
                        <VoteDetails>
                          <VoteCount>{option.votes} votes</VoteCount>
                          <VotePercentage>({percentage}%)</VotePercentage>
                        </VoteDetails>
                      </DetailedResult>
                    );
                  })}
                </ExpandedResults>
              )}
            </HistoryItem>
          );
        })}
      </HistoryList>
    </Container>
  );
}

export default PollHistory; 