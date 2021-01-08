import { combineReducers } from "@reduxjs/toolkit";
import error from "./errorSlice";
import menu from "./menuSlice";
import option from "./optionSlice";
import viz from "./vizSlice";

const rootReducer = combineReducers({
  error,
  menu,
  option,
  viz,
});

export default rootReducer;
