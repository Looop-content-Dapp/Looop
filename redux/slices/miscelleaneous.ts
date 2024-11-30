import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  onBoarded: boolean;
}

const initialState: InitialState = {
  onBoarded: false,
};

const miscReducer = createSlice({
  name: "miscelleaneaous",
  initialState,
  reducers: {
    updateOnBoarded: (state) => {
      state.onBoarded = true;
    },
  },
});

export const { updateOnBoarded } = miscReducer.actions;

export default miscReducer.reducer;
