import React, { useState } from "react";
import "./TitleBar.css";
import CloseIcon from "../assets/close.svg";
import MinimizeIcon from "../assets/lower.svg";
import MaximizeIcon from "../assets/maximize.svg";
import ShrinkIcon from "../assets/minimize.svg";

const TitleBar = () => {
  const [windowState, setWindowState] = useState("Minimized");

  const changeWindowState = () => {
    if (windowState === "Minimized") {
      setWindowState("Maximized");
    } else {
      setWindowState("Minimized");
    }
  };

  const handleLowering = () => {
    window.electron.ipcRenderer.send("window-minimize");
  };

  const handleWindowState = () => {
    window.electron.ipcRenderer.send("window-maximize");
    changeWindowState();
  };

  const handleClose = () => {
    window.electron.ipcRenderer.send("window-close");
  };

  return (
    <div className="title-bar">
      <div className="title-bar-draggable"></div>
      <div className="title-bar-buttons">
        <button className="title-button" onClick={handleLowering}>
          <img src={MinimizeIcon} alt="Lower window" />
        </button>
        <button className="title-button" onClick={handleWindowState}>
          {windowState === "Minimized" ? (
            <img src={MaximizeIcon} alt="Maximize" />
          ) : (
            <img src={ShrinkIcon} alt="Shrink" />
          )}
        </button>
        <button className="title-button" onClick={handleClose}>
          <img src={CloseIcon} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
