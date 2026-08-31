/**
 * Chess Game - Main Application
 */

class ChessGame {
  constructor() {
    this.board = this.initializeBoard();
    this.selectedSquare = null;
    this.init();
  }

  initializeBoard() {
    // Initialize an 8x8 chessboard with starting positions
    const board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Set up starting positions
    const pieces = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    return pieces;
  }

  getPieceSymbol(piece) {
    const symbols = {
      'p': '♟', 'P': '♙',
      'r': '♜', 'R': '♖',
      'n': '♞', 'N': '♘',
      'b': '♝', 'B': '♗',
      'q': '♛', 'Q': '♕',
      'k': '♚', 'K': '♔',
    };
    return symbols[piece] || '';
  }

  renderBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.className = 'chess-square';
        square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
        square.dataset.row = row;
        square.dataset.col = col;

        const piece = this.board[row][col];
        if (piece) {
          square.textContent = this.getPieceSymbol(piece);
        }

        square.addEventListener('click', () => this.handleSquareClick(row, col));
        chessboard.appendChild(square);
      }
    }
  }

  handleSquareClick(row, col) {
    if (this.selectedSquare) {
      this.selectedSquare = null;
    } else {
      this.selectedSquare = { row, col };
    }
    this.updateGameInfo();
    this.renderBoard();
  }

  updateGameInfo() {
    const gameInfo = document.getElementById('game-info');
    gameInfo.textContent = 'Game Status: Ready to play!';
  }

  init() {
    this.renderBoard();
    this.updateGameInfo();
  }
}

// Initialize the game when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ChessGame();
});
