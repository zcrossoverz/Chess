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
        let turnValue;
        if(element.flags === 'q'){
            console.log('nhap thanh canh hau');
            turnValue = 80;
        }else if(element.flags === 'k') {
            console.log('nhap thanh vua');
            turnValue = 75;
        }else if(element.flags === 'p'){
            console.log('tien chot');
            turnValue = 70;
        }else if(element.flags === 'c') {
            console.log(element);
            turnValue = valuePiece(element.captured);
            console.log(valuePiece(element.captured));
        }else if(element.flags === 'e'){
            console.log('bat tot qua duong');
            turnValue = 60;
        }else{
           // console.log('bth');
            turnValue = 5;
        }

        if(bestMove.value < turnValue){
            bestMove.value = turnValue;
            bestMove.move = element;
        }
    });
    return bestMove;
}

function valuePiece(captured){
    switch (captured){
        case 'p': return 10; // tot
        case 'n': return 30; // ngua
        case 'b': return 30; // tuong
        case 'r': return 50; // xe
        case 'q': return 90; // hau
        default: return 900; // vua
    }
}

function calculateBoard(){
    console.log(chess.board());
}


function minimax(depth, isMaxPlayer){
    let bestMove;
    if(depth === 0) return;
    else{
        if(isMaxPlayer){
            
        }else{

        }
    }
}

calculateBoard();

// setInterval(() => {
//     if(!chess.game_over()) calculateMove();
// }, 1000);