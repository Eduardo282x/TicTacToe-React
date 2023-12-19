import { useState } from "react"
import confetti from "canvas-confetti";
import { Square } from "./components/Square";
import { turns } from "./constants";
import { checkWinnerFrom, checkEndGame } from "./components/board";
import { WinnerModal } from "./components/WinnerModal";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = localStorage.getItem('board');
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
    });
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = localStorage.getItem('turn');
      return turnFromStorage ? turnFromStorage: turns.x
    });
  const [winner, setTWinner] = useState(null);

  const updateBoard = (index) => {
    if(board[index] || winner) return  
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn == turns.x ? turns.o : turns.x;
    setTurn(newTurn)

    localStorage.setItem('board', JSON.stringify(newBoard))
    localStorage.setItem('turn', newTurn)

    const newWinner = checkWinnerFrom(newBoard);

    if(newWinner) {
      confetti();
      setTWinner(newWinner)
    } else if(checkEndGame(newBoard)){
      setTWinner(false);
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(turns.x);
    setTWinner(null);

    localStorage.removeItem('board');
    localStorage.removeItem('turn');
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Empezar de nuevo</button>
      <section className="game">
        {board.map((square,index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          )
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn == turns.x}>{turns.x}</Square>
        <Square isSelected={turn == turns.o}>{turns.o}</Square>
      </section>

        <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App