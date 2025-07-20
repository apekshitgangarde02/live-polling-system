import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isOpen: false,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  setMessages,
  toggleChat,
  openChat,
  closeChat,
  setLoading,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer; 