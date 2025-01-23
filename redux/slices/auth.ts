import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  userdata: SignInUserData | null;
  token: string | null;
  claimId: string | null;
  artistId: string | null
}

const initialState: InitialState = {
  token: null,
  userdata: null,
  claimId: null,
  artistId: null
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
    setClaimId: (state, action) => {
      state.claimId = action.payload;
    },
    setArtistId: (state, action) => {
        state.artistId = action.payload;
      },
  },
});

export const { setToken, setUserData, setClaimId, setArtistId } = authSlice.actions;

export default authSlice.reducer;
