import React from "react";
import BoardSquare from "./BoardSquare";

export default function Board({board}) {


    function getPosition(i){
        return {
            x: i%8,
            y: Math.abs(Math.floor(i/8) - 7)
        }
    }

    function isBlack(i){
        const {x,y} = getPosition(i);
        return  (x+y)%2 === 1;
    }

    return (
        <div className="board">
            {board.flat().map((piece, i) => (
                <div key={i} className="square">
                    <BoardSquare piece={piece} black={isBlack(i)} />
                </div>
            ))}
        </div>
    );
}