import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedIndex: false,
  prevFeedIndex: false,
  feedTitle: {
    0: "Earthquakes Past Hour",
    1: "Earthquakes Past Day",
    2: "Earthquakes Past Week",
    3: "Earthquakes Past Month",
  },
  autoRotation: true,
  clickXRotation: false,
  clickYRotation: false,
  simulationGlobe: true,
  physicalGlobe: false,
  politicalGlobe: false,
  tectonicGlobe: false,
};

const globeTypes = [
  "simulationGlobe",
  "physicalGlobe",
  "politicalGlobe",
  "tectonicGlobe",
];

const optionSlice = createSlice({
  name: "option",
  initialState,
  reducers: {
    setFeedIndex: (state, action) => {
      state.prevFeedIndex = state.feedIndex;
      state.feedIndex = action.payload;
      return state;
    },
    setAutoRotation: (state, action) => {
      console.log({setAutoRotation: action.payload})
      state.autoRotation = action.payload;
      if (!action.payload){
        state.clickXRotation = true;
        state.clickYRotation = true;
      }
      return state;
    },
    setClickXRotation: (state, action) => {
      state.clickXRotation = action.payload;
      state.autoRotation = false;
      return state;
    },
    setClickYRotation: (state, action) => {
      state.clickYRotation = action.payload;
      state.autoRotation = false;
      return state;
    },
    setGlobe: (state, action) => {
      globeTypes.forEach((type) => {
        state[type] = type === action.payload ? true : false;
      });
      return state;
    },
  },
});

export const {
  setFeedIndex,
  setAutoRotation,
  setClickXRotation,
  setClickYRotation,
  setGlobe,
} = optionSlice.actions;
export default optionSlice.reducer;
