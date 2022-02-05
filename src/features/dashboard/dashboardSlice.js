import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from './dashboardAPI';

const initialState = {
  users: null,
  status: 'idle',
};

export const fetchUsersAsync = createAsyncThunk(
  'dashboard/fetchUsers',
  async () => {
    const response = await fetchUsers();
    return response;
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    removeUser: (state, action) => {
      state.users = [...state.users].filter(user => user?.id !== action?.payload);
    },
    updateUser: (state, action) => {
      const userIndex = state?.users?.findIndex(user => user?.id ===action?.payload?.id)
      state.users[userIndex] = action?.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.users = action.payload;
      });
  },
});

export const { addUser, removeUser, updateUser } = dashboardSlice.actions;
export const selectUsers = (state) => state.dashboard.users;
export const selectStatus = (state) => state.dashboard.status;


export default dashboardSlice.reducer;
