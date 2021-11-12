import React, {useEffect, useState} from "react";
import {gameSubject,initGame} from "./Game";
import Board from "./Board";
import "./Style.css";

function App() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setisGameOver] = useState();
  const [result, setResult] = useState();
  const [isMyTurn, setIsMyTurn] = useState();
  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe(({board, isGameOver, result, turn}) => {
      setBoard(board);
      setisGameOver(isGameOver);
      setResult(result);
      setIsMyTurn(turn === 'w' ? 1:0);
    });
    return () => subscribe.unsubscribe();
  }, []);
  return (
    <div className="main">
      <div className="container">
        <Board board={board} />
      </div>
      <div className="status">
        { (!isGameOver) && (
          <center><h2>Lượt của {isMyTurn ? 'bạn':'máy'}</h2></center>
        )
        }
        { (!isMyTurn && !isGameOver) && (
          <div>
          <br/>
          <h4>Đang suy nghĩ...</h4>
          </div>
        )
        }
        {
        isGameOver && (
          <div>
          <center><h2>GAME OVER</h2></center>
          <center><p>{result}</p></center>
          </div>
        )
      }
      </div>
    </div>
  );
}

export default App;
