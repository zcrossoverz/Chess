import React, {useEffect, useState} from "react";
import {gameSubject,initGame} from "./Game";
import Board from "./Board";
import "./Style.css";

function App() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setisGameOver] = useState();
  const [result, setResult] = useState();
  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe(({board, isGameOver, result}) => {
      setBoard(board);
      setisGameOver(isGameOver);
      setResult(result);
    });
    return () => subscribe.unsubscribe();
  }, []);
  return (
    <div className="main">
      <div className="container">
        <Board board={board} />
      </div>
      <div className="status">
        {
        isGameOver && (
          <div>
          <h2>GAME OVER</h2>
          <p>{result}</p>
          </div>
        )
      }
      </div>
    </div>
  );
}

export default App;
