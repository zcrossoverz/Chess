import React from "react";

export default function Piece({piece : {type, color}}) {
    const pieceImg = require(`./assets/${type}_${color}.png`);
    return (
        <div className="piece-container">
            <img src={pieceImg.default} alt="" className="piece" />
            {/* {`${type}_${color}`} */}
        </div>
    );
}