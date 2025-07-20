import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null, // 'teacher' or 'student'
  tabId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.user = { ...state.user, name: action.payload };
      state.isAuthenticated = true;
      localStorage.setItem('pollingUser', JSON.stringify(state.user));
    },
    setRole: (state, action) => {
      state.role = action.payload;
      state.user = { ...state.user, role: action.payload };
      localStorage.setItem('pollingUser', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.tabId = null;
      localStorage.removeItem('pollingUser');
    },
    initializeAuth: (state) => {
      const savedUser = localStorage.getItem('pollingUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        state.user = userData;
        state.isAuthenticated = !!userData.name;
        state.role = userData.role || null;
        state.tabId = userData.tabId || null;
      }
    },
  },
});

export const { setName, setRole, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer; 