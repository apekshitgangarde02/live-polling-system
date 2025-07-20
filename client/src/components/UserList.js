import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h3`
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserCount = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const UserGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupTitle = styled.h4`
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.role === 'teacher' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const UserRole = styled.span`
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const KickButton = styled.button`
  background: #e74c3c;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #c0392b;
    transform: scale(1.05);
  }
`;

const NoUsers = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.9rem;
`;

function UserList({ users, onKickUser }) {
  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'student');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderUserItem = (user) => (
    <UserItem key={user.id}>
      <UserInfo>
        <UserAvatar role={user.role}>
          {getInitials(user.name)}
        </UserAvatar>
        <div>
          <UserName>{user.name}</UserName>
          <UserRole>{user.role}</UserRole>
        </div>
      </UserInfo>
      {user.role === 'student' && onKickUser && (
        <KickButton onClick={() => onKickUser(user.id)}>
          Kick
        </KickButton>
      )}
    </UserItem>
  );

  if (users.length === 0) {
    return (
      <Container>
        <Title>
          Connected Users
          <UserCount>0</UserCount>
        </Title>
        <NoUsers>No users connected</NoUsers>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        Connected Users
        <UserCount>{users.length}</UserCount>
      </Title>

      {teachers.length > 0 && (
        <UserGroup>
          <GroupTitle>Teachers ({teachers.length})</GroupTitle>
          {teachers.map(renderUserItem)}
        </UserGroup>
      )}

      {students.length > 0 && (
        <UserGroup>
          <GroupTitle>Students ({students.length})</GroupTitle>
          {students.map(renderUserItem)}
        </UserGroup>
      )}
    </Container>
  );
}

export default UserList; 