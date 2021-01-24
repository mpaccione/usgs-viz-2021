import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { register } from "register-service-worker";
import "semantic-ui-css/semantic.min.css";
import "@/global.scss";

import App from "@/App";
import store from "@/redux/store.js";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

register("/service-worker.js", {
  registrationOptions: { scope: "./" },
  ready(registration) {
    console.log("Service worker is active.");
  },
  registered(registration) {
    console.log("Service worker has been registered.");
  },
  cached(registration) {
    console.log("Content has been cached for offline use.");
  },
  updatefound(registration) {
    console.log("New content is downloading.");
  },
  updated(registration) {
    console.log("New content is available; please refresh.");
  },
  offline() {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
  },
  error(error) {
    console.error("Error during service worker registration:", error);
  },
});
