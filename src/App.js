import React from 'react';
import './App.css';
import Transcripto from './components/Transcripto';
import bgImage from './TRANSCRIPTO.webp';

function App() {
  return (
    <div
      className="App"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Transcripto />
    </div>
  );
}

export default App;