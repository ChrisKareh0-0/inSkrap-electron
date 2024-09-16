import React from "react";
import "./Switch.css";

const Switch = ({ toggleSwitch, toggleValue }) => {
  return (
    <div
      className={`switch ${toggleValue ? "on" : "off"}`}
      onClick={toggleSwitch}
    >
      <div className="toggle"></div>
    </div>
  );
};

export default Switch;
