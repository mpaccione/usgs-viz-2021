import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vizLoad: false,
  vizInit: false,
  preloaderText: "",
  responseComplete: "",
  progressComplete: ""
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setVizLoad: (state, action) => {
      state.vizLoad = action.payload;
      return state;
    },
    setVizInit: (state, action) => {
      state.vizInit = action.payload;
      return state;
    },
    setResponseComplete: (state, action) => {
      state.responseComplete = action.payload;
      return state;
    },
    setProgressComplete: (state, action) => {
      state.progressComplete = action.payload;
      return state;
    },
  },
});

export const {
    setVizLoad,
    setVizInit,
    setResponseComplete,
    setProgressComplete,
} = menuSlice.actions;
export default menuSlice.reducer;