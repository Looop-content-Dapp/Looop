import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  userdata: SignInUserData | null;
  token: string | null;
}

const initialState: InitialState = {
  token: null,
  userdata: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userdata = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken, setUserData } = authSlice.actions;

export default authSlice.reducer;
