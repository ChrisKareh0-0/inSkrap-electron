import React from 'react';
import { Route, Routes, Link, HashRouter } from 'react-router-dom';

import NeuralNoiseBackground from './Components/background';
import SearchPage from './Pages/searchPage';
import './App.css';

function App() {
  console.log("is the project running")
  return (
    <HashRouter>
      <div className="App">
        {/* <NeuralNoiseBackground /> */}
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
    <div className="home">
      <NeuralNoiseBackground />
      <div className="content">
        <h1 style={{color: '#fff'}}>Welcome to inSkrap</h1>
        {/* <p style={{color:'#fff'}}>This is supposed to be the landing page.</p> */}
        <Link to="/search">
        <button className="btn"><i className="animation"></i>Get Started<i className="animation"></i>
        </button>
        </Link>
      </div>
    </div>
  );
}

export default App;
