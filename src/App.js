import React, {useEffect, useState} from "react";
import {gameSubject,initGame} from "./Game";
import Board from "./Board";
import "./Style.css";

function App() {
  const [board, setBoard] = useState([]);
  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe(game => setBoard(game.board));
    return () => subscribe.unsubscribe();
  }, []);
  return (
    <div className="main">
      <div className="container">
        <Board board={board} />
      </div>
    </div>
  );
}

export default App;
