import * as Chess from "chess.js";
import {BehaviorSubject} from "rxjs";

 let promotion = 'rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5';
 let stateMate = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78';
 let checkMate = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 2';
 let insuficcientMaterial = 'k7/8/n7/8/8/8/8/7K b - - 0 1';

 let c1 = '8/4k3/8/8/3n4/8/8/2KQ4 w - - 0 51';
 let c2= '1Q6/4k3/8/1n6/8/8/8/1K6 b - - 10 60';

const chess = new Chess();

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
        updateGame();
    }
}


function updateGame(pendingPromotion){
    
    const isGameOver = chess.game_over();
    const newGame = {
        turn: chess.turn(),
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        result: isGameOver ? getGameResult() : null
    };
    gameSubject.next(newGame);
    if(chess.turn() === 'b') {
        setTimeout(call_minimax, 0);
    }
}

function getGameResult() {
        if(chess.in_checkmate()) {
            const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
            return `CHECKMATE - ${winner} THẮNG`;
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
            return `HÒA - ${reason}`;
        }else{
            return 'UNKNOWN REASON';
        }
}


let valuePiece = {
    p: 10, // tot
    n: 30, // ngua
    b: 30, // tuong
    r: 50, // xe
    q: 90, // hau
    k: 900 // vua
};

function scoreBoard(isMax){
    let score = 0;
    let color = isMax ? 'b' : 'w';
    chess.board().forEach((e) => {
        e.forEach((k) => {
            if(k && k.color === color) {
                score += valuePiece[k.type];
            }
        });
    });
    // return isMax?score:-score;
    return score;
}

function evaluate(isMax){
    // return !isMax ? scoreBoard(false) - scoreBoard(true) : scoreBoard(true) - scoreBoard(false);
    scoreBoard(isMax);
}

let num = 0;

async function call_minimax(){
    let moves = chess.moves({ verbose: true }).sort((a, b) => 0.5 - Math.random());
    let bestMove = {
        value: -9999,
        move
    };
    moves.forEach((e) => {
        num++;
       chess.move(e.san);
        let evaluate = minimax(2, false, -10000, 10000);
        if(evaluate > bestMove.value){
            bestMove.value = evaluate;
            bestMove.move = e;
        }
        chess.undo();
      //  console.log('nuoc di: '+evaluate+' :'+e.san);
        
    });
    // console.log(bestMove);
    handleMove(bestMove.move.from, bestMove.move.to);
    console.log('số nước đi đã tính được: '+num);
    num = 0;
}

function minimax(depth, isMax, alpha, beta){
    if(depth === 0) return -scoreBoard(isMax);
    if(isMax){
        let value = -9999;
        chess.moves({ verbose: true }).forEach((e) => {
            num++;
            chess.move(e.san);
            if(chess.in_check()) value += 20;
            value = Math.max(value, minimax(depth-1, false, -10000, 10000));
            chess.undo();
            alpha = Math.max(alpha, value);
	        if(beta <= alpha)
	      	   return value;
        });

        return value;
    }else{
        let value = 9999;
        chess.moves({ verbose: true }).forEach((e) => {
            num++;
            chess.move(e.san);
            if(chess.in_check()) value -= 20;
            value = Math.min(value, minimax(depth-1, true, -10000, 10000));
            chess.undo();
            beta = Math.min(beta, value);
	        if(beta <= alpha)
	      	   return value;
        });

        return value;
    }
}

