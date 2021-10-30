import * as Chess from "chess.js";
import {BehaviorSubject} from "rxjs";

const chess = new Chess();

export const gameSubject = new BehaviorSubject({
    board: chess.board()
});

export function move(from, to) {
    // console.log(from,to);
    const legalMove = chess.move({from,to});
    if(legalMove) {
        gameSubject.next({board: chess.board() });
    }
}