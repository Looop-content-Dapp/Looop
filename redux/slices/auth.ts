import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  userdata: any | null;
  token: string | null;
}

const initialState: InitialState = {
  token: null,
  userdata: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;

export default authSlice.reducer;
