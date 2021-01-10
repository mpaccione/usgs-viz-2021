import axios from "axios";
import store from "@/redux/store";
import {
  setErrorMessage,
  clearErrorMessage,
} from "@/redux/reducers/errorSlice";

// export const baseURL =
//   !process.env.NODE_ENV || process.env.NODE_ENV === "development"
//     ? "http://localhost:8081"
//     : "https://quakeviz.app";

export const baseURL = "https://quakeviz.app";

const axiosReq = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    }
})    

export const post = async (path, obj) => {
  try {
    const response = await axiosReq.post(path, obj);
    return response;
  } catch (error) {
    throw error;
  }
};

export const get = async (path, obj) => {
  try {
    const response = await axiosReq.get(path, { params: obj });
    return response;
  } catch (error) {
    throw error;
  }
};

export const dispatchError = (err) => {
  store.dispatch(
    setErrorMessage(err.message !== undefined ? err.message : err.toString())
  );
  setTimeout(() => {
    store.dispatch(clearErrorMessage());
  }, 5000);
};
