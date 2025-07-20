import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setName, setRole } from '../store/slices/authSlice';
import { v4 as uuidv4 } from 'uuid';

const Login = ({ onLogin }) => {
  const [name, setNameState] = useState('');
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const tabId = sessionStorage.getItem('tabId') || uuidv4();
      sessionStorage.setItem('tabId', tabId);
      
      // The role is now determined by the server.
      // The client will learn its role upon joining.
      dispatch(setName(name));
      // We no longer set the role from the client side.
      // dispatch(setRole(role)); 

      onLogin({ name, tabId });
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to the Polling App</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setNameState(e.target.value)}
          required
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Login; 