import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from './dashboardAPI';

const initialState = {
  users: null,
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchUsersAsync = createAsyncThunk(
  'dashboard/fetchUsers',
  async () => {
    const response = await fetchUsers();
    // The value we return becomes the `fulfilled` action payload
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

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUsers = (state) => state.dashboard.users;
export const selectStatus = (state) => state.dashboard.status;


export default dashboardSlice.reducer;
