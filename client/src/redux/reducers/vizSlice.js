import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quakes: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
  threeData: {
    0: null,
    1: null,
    2: null,
    3: null,
  },
  searchWord: "",
  selectedQuakeIndex: null,
  previousQuakeIndex: null,
  vizTextureRendered: false,
};

const vizSlice = createSlice({
  name: "viz",
  initialState,
  reducers: {
    setQuakes: (state, action) => {
      state.quakes = action.payload;
      return state;
    },
    setQuakesByIndex: (state, action) => {
      const { index, value } = action.payload;
      const newQuakesObj = { ...state.quakes, [index]: value };
      state.quakes = newQuakesObj;
      return state;
    },
    setSelectedQuakeIndex: (state, action) => {
      state.previousQuakeIndex = state.selectedQuakeIndex;
      state.selectedQuakeIndex = action.payload;
      return state;
    },
    setThreeData: (state, action) => {
      state.threeData = action.payload;
      return state;
    },
    setThreeDataByIndex: (state, action) => {
      const { index, value } = action.payload;
      const newThreeDataObj = { ...state.threeData, [index]: value };
      state.threeData = newThreeDataObj;
      return state;
    },
    setVizTextureRendered: (state, action) => {
      state.vizTextureRendered = action.payload;
      return state;
    },
    setSearchWord: (state, action) => {
      state.searchWord = action.payload;
      return state;
    }
  },
});

export const {
  setQuakes,
  setQuakesByIndex,
  setSelectedQuakeIndex,
  setThreeData,
  setThreeDataByIndex,
  setVizTextureRendered,
  setSearchWord,
} = vizSlice.actions;
export default vizSlice.reducer;
