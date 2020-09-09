import React from "react";
import { useRef } from "./store";

export function App() {
  console.log("render App");

  return (
    <div>
      <Ref id="a" />
      <Ref id="b" />
      <Ref id="c" />
    </div>
  );
}

function Ref({ id }) {
  console.log("render Ref", id);

  const { value, setValue } = useRef(id);

  const handleClick = () => {
    setValue(value + id);
  };

  return (
    <div>
      Ref: {value} <button onClick={handleClick}>append</button>
    </div>
  );
}
