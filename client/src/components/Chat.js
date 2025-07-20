import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addMessage } from '../store/slices/chatSlice';
import socketService from '../services/socketService';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  overflow: hidden;
  background: white;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8f9fa;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  background: ${props => props.isOwn ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.isOwn ? 'white' : '#333'};
  padding: 10px 14px;
  border-radius: 18px;
  border: ${props => props.isOwn ? 'none' : '1px solid #e1e5e9'};
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MessageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.8rem;
`;

const SenderName = styled.span`
  font-weight: 600;
  color: ${props => props.isOwn ? '#667eea' : '#666'};
`;

const MessageTime = styled.span`
  color: #999;
  font-size: 0.7rem;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: white;
  border-top: 1px solid #e1e5e9;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const NoMessages = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 20px;
`;

const RoleBadge = styled.span`
  background: ${props => props.role === 'teacher' ? '#667eea' : '#27ae60'};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 6px;
`;

function Chat({ isOpen, onToggle }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage.trim()
    };

    socketService.sendMessage(messageData);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <span>💬 Live Chat</span>
        <CloseButton onClick={onToggle}>×</CloseButton>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 ? (
          <NoMessages>No messages yet. Start the conversation!</NoMessages>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            
            return (
              <Message key={message.id} isOwn={isOwn}>
                <MessageInfo>
                  <SenderName isOwn={isOwn}>
                    {message.sender}
                    <RoleBadge role={message.role}>
                      {message.role}
                    </RoleBadge>
                  </SenderName>
                  <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                </MessageInfo>
                <MessageBubble isOwn={isOwn}>
                  {message.text}
                </MessageBubble>
              </Message>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <MessageInput
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            maxLength={200}
          />
          <SendButton type="submit" disabled={!newMessage.trim()}>
            Send
          </SendButton>
        </form>
      </InputContainer>
    </ChatContainer>
  );
}

export default Chat; 