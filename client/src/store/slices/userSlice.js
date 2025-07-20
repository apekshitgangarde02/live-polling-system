import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connectedUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setConnectedUsers: (state, action) => {
      state.connectedUsers = action.payload;
    },
    addUser: (state, action) => {
      state.connectedUsers.push(action.payload);
    },
    removeUser: (state, action) => {
      state.connectedUsers = state.connectedUsers.filter(
        user => user.id !== action.payload
      );
    },
    updateUser: (state, action) => {
      const index = state.connectedUsers.findIndex(
        user => user.id === action.payload.id
      );
      if (index !== -1) {
        state.connectedUsers[index] = action.payload;
      }
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
  },
});

export const {
  setConnectedUsers,
  addUser,
  removeUser,
  updateUser,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer; 