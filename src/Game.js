import * as Chess from "chess.js";
import {BehaviorSubject} from "rxjs";

 let promotion = 'rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5';
 let stateMate = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78';
 let checkMate = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 2';
 let insuficcientMaterial = 'k7/8/n7/8/8/8/8/7K b - - 0 1';

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
    //if(chess.turn() === 'b') {
        cal(chess.turn() === 'b');
    //}
    const isGameOver = chess.game_over();
    if(chess.in_check()) console.log('in check');
    if(chess.in_checkmate()) console.log('in checkmate');
    const newGame = {
        turn: chess.turn(),
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


function calculateMove(){
    let moves = chess.moves({ verbose: true }); // danh sach cac nuoc di hop le
    let bestMove = {
        move,
        value: -999
    };
    moves.forEach(element => {
        chess.move(element.san);
        let evalute = scoreBoard(true);
        chess.undo();
        if(evalute > bestMove.value){
            bestMove.value = evalute;
            bestMove.move = element;
        }
    });
    return bestMove;
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
            if(k && k.color == color) {
                score += valuePiece[k.type];
            }
        });
    });
    return score;
}

function evaluate(isMax){
    return !isMax ? scoreBoard(false) - scoreBoard(true) : scoreBoard(true) - scoreBoard(false);
}


function cal(black){
    let moves = chess.moves({ verbose: true });
    let bestMove = {
        value: -999,
        move
    };
    moves.forEach((e) => {
        chess.move(e.san);
        let evaluate = minimax(2, black);
        if(evaluate > bestMove.value){
            bestMove.value = evaluate;
            bestMove.move = e;
        }
        chess.undo();
        
    });
    // console.log(bestMove);
    handleMove(bestMove.move.from, bestMove.move.to);
}

function minimax(depth, isMax){
    if(depth == 0) return evaluate(isMax);
    if(isMax){
        let value = -9999;
        chess.moves({ verbose: true }).forEach((e) => {
            chess.move(e.san);
            value = Math.max(value, minimax(depth-1, !isMax));
            chess.undo();
        });
        return value;
    }else{
        let value = 9999;
        chess.moves({ verbose: true }).forEach((e) => {
            chess.move(e.san);
            value = Math.min(value, minimax(depth-1, !isMax));
            chess.undo();
        });
        return value;
    }
}


// setInterval(()=> {
//     cal()
// },5000);
