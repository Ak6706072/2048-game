import React from "react";
import Board from "./Components/Board";
import "./App.css";
function App() {
  return (
    <div className="app">
      <h1>2048 Game</h1>
      <div className="app_board">
        <Board />
      </div>
    </div>
  );
}

export default App;
