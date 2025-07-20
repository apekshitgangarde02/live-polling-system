import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pollReducer from './slices/pollSlice';
import chatReducer from './slices/chatSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poll: pollReducer,
    chat: chatReducer,
    user: userReducer,
  },
}); 