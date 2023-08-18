import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  token: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    storeToken: (state, action) => {
      state.token = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    subscription: (state, action) => {
      console.log(
        "sliceeeeeee",
        action.payload,
        state.currentUser.subscribedUsers.includes(action.payload)
      );
      if (state.currentUser.subscribedUsers.includes(action.payload)) {
        state.currentUser.subscribedUsers.splice(
          state.currentUser.subscribedUsers.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
        if (state.currentUser.subscribers > 0) {
          state.currentUser.subscribers--;
        }
      } else {
        state.currentUser.subscribedUsers.push(action.payload);
        state.currentUser.subscribers++;
      }
    },
  },
});

export const {
  loginFailure,
  loginSuccess,
  loginStart,
  storeToken,
  logout,
  subscription,
} = userSlice.actions;
export default userSlice.reducer;
