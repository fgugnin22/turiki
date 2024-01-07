import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
  // <React.StrictMode> // this sometimes fucks up the teamregisterform checkboxes so they dont work as intended

  // </React.StrictMode>
);
