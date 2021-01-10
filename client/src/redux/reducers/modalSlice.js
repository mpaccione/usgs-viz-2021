import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalText: ""
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalText: (state, action) => {
      state.modalText = action.payload;
      return state;
    },
  },
});

export const {
  setModalText,
} = modalSlice.actions;
export default modalSlice.reducer;