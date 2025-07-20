import io from 'socket.io-client';
import { store } from '../store';
import {
  setActivePoll,
  updatePollResults,
  setPollEnded,
  submitAnswer,
  setError,
} from '../store/slices/pollSlice';
import { setConnectedUsers } from '../store/slices/userSlice';
import { addMessage } from '../store/slices/chatSlice';
import { setRole } from '../store/slices/authSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    this.socket = io('http://localhost:5000');
    
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('roleAssigned', (role) => {
      store.dispatch(setRole(role));
    });

    this.socket.on('error', (error) => {
      store.dispatch(setError(error));
    });

    this.socket.on('kicked', (message) => {
      store.dispatch(setError(message));
      // Redirect to login or show kicked message
    });

    this.socket.on('newPoll', (pollData) => {
      store.dispatch(setActivePoll({
        ...pollData,
        canAnswer: true,
        timeLeft: pollData.maxTime
      }));
    });

    this.socket.on('pollUpdate', (data) => {
      store.dispatch(updatePollResults(data));
    });

    this.socket.on('pollEnded', (pollData) => {
      store.dispatch(setPollEnded(pollData));
    });

    this.socket.on('userList', (users) => {
      store.dispatch(setConnectedUsers(users));
    });

    this.socket.on('newMessage', (message) => {
      store.dispatch(addMessage(message));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  join(userData) {
    if (this.socket) {
      this.socket.emit('join', userData);
    }
  }

  createPoll(pollData) {
    if (this.socket) {
      this.socket.emit('createPoll', pollData);
    }
  }

  submitAnswer(answerData) {
    if (this.socket) {
      this.socket.emit('submitAnswer', answerData);
      store.dispatch(submitAnswer());
    }
  }

  endPoll() {
    if (this.socket) {
      this.socket.emit('endPoll');
    }
  }

  kickStudent(studentId) {
    if (this.socket) {
      this.socket.emit('kickStudent', studentId);
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('sendMessage', messageData);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService(); 