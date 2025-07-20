import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePoll: null,
  pollHistory: [],
  timeLeft: 0,
  canAnswer: false,
  hasAnswered: false,
  loading: false,
  error: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setActivePoll: (state, action) => {
      state.activePoll = action.payload;
      state.canAnswer = action.payload.canAnswer || false;
      state.timeLeft = action.payload.timeLeft || 0;
    },
    updatePollResults: (state, action) => {
      if (state.activePoll) {
        state.activePoll = { ...state.activePoll, ...action.payload.poll };
        state.canAnswer = action.payload.canAnswer;
        state.timeLeft = action.payload.timeLeft;
      }
    },
    setPollEnded: (state, action) => {
      state.activePoll = null;
      state.canAnswer = false;
      state.timeLeft = 0;
      state.hasAnswered = false;
      
      // Add to history
      state.pollHistory.unshift(action.payload);
    },
    submitAnswer: (state, action) => {
      state.hasAnswered = true;
      state.canAnswer = false;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPoll: (state) => {
      state.activePoll = null;
      state.canAnswer = false;
      state.timeLeft = 0;
      state.hasAnswered = false;
    },
  },
});

export const {
  setActivePoll,
  updatePollResults,
  setPollEnded,
  submitAnswer,
  setPollHistory,
  setTimeLeft,
  setLoading,
  setError,
  clearError,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer; 