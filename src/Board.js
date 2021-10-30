import React from "react";
import BoardSquare from "./BoardSquare";

export default function Board({board}) {


    function getCoordinate(i){
        return {
            x: i%8,
            y: Math.abs(Math.floor(i/8) - 7)
        }
    }

    function getPosition(i){
        const {x,y} = getCoordinate(i);
        const letter = ['a','b','c','d','e','f','g','h'][x];
        return `${letter}${y+1}`;
    }

    function isBlack(i){
        const {x,y} = getCoordinate(i);
        return  (x+y)%2 === 1;
    }

    return (
        <div className="board">
            {board.flat().map((piece, i) => (
                <div key={i} className="square">
                    <BoardSquare piece={piece} black={isBlack(i)} position={getPosition(i)} />
                </div>
            ))}
        </div>
    );
}