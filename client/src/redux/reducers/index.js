import { combineReducers } from "@reduxjs/toolkit";
import error from "./errorSlice";
import menu from "./menuSlice";
import option from "./optionSlice";
import viz from "./vizSlice";
import modal from "./modalSlice";

const rootReducer = combineReducers({
  error,
  menu,
  option,
  viz,
  modal,
});

export default rootReducer;
