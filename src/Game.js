import * as Chess from "chess.js";
import {BehaviorSubject} from "rxjs";

 let promotion = 'rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5';
 let stateMate = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78';
 let checkMate = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 2';
 let insuficcientMaterial = 'k7/8/n7/8/8/8/8/7K b - - 0 1';

const chess = new Chess(checkMate);

export const gameSubject = new BehaviorSubject({
    board: chess.board(),
});

export function initGame() {
    updateGame();
}

export function handleMove(from, to) {
    const promotions = chess.moves({verbose:true}).filter(m => m.promotion);
    console.table(promotions);
    if(promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)){
        // console.log('ok');
        const pendingPromotion = {from, to, color: promotions[0].color};
        updateGame(pendingPromotion);
    }
    const {pendingPromotion} =  gameSubject.getValue();
    if(!pendingPromotion){
        move(from, to);
    }
}

export function move(from, to, promotion) {
    let tempMove = {from, to};
    if(promotion){
        tempMove.promotion = promotion;
    }
    // console.log(from,to);
    const legalMove = chess.move(tempMove);
    if(legalMove) {
        updateGame()
    }
}



function updateGame(pendingPromotion){
    const isGameOver = chess.game_over();
    if(chess.in_check()) console.log('in check');
    if(chess.in_checkmate()) console.log('in checkmate');
    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        result: isGameOver ? getGameResult() : null
    };
    gameSubject.next(newGame);
}

function getGameResult() {
        if(chess.in_checkmate()) {
            const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
            return `CHECKMATE - WINNER - ${winner}`;
        } else if (chess.in_draw()) {
            // console.log('hoa');
            let reason = '50 - MOVES - RULE';
            if(chess.in_stalemate()) {
                reason = 'STALEMATE';
            }else if(chess.in_threefold_repetition()){
                reason = 'REPETITION';
            }else if(chess.insufficient_material()){
                reason = 'INSUFFICIENT MATERIAL';
            }
            return `DRAW - ${reason}`;
        }else{
            return 'UNKNOWN REASON';
        }
}