import React from "react";
import { Route, Routes, Link, HashRouter } from "react-router-dom";

import NeuralNoiseBackground from "./Components/background";
import SearchPage from "./Pages/searchPage";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

function Home() {
  return (
    <>
      <NeuralNoiseBackground />
      <div className="home">
        <div className="content">
          <h1>Welcome to inSkrap</h1>
          <Link to="/search">
            <button className="btn">
              <i className="animation"></i>Get Started
              <i className="animation"></i>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default App;
