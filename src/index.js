import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { StoreProvider } from "./store";

ReactDOM.render(
  <StoreProvider initialState={{ a: "a", b: "b", c: "c" }}>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
