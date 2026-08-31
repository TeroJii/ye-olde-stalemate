/**
 * Chess Game - Main Application
 */

class ChessGame {
  constructor() {
    this.board = this.initializeBoard();
    this.selectedSquare = null;
    this.currentTurn = 'white'; // 'white' or 'black'
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

  getPieceColor(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
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
        
        if (this.selectedSquare && this.selectedSquare.row === row && this.selectedSquare.col === col) {
          square.classList.add('selected');
        }
        
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
    const clickedPiece = this.board[row][col];
    const clickedPieceColor = this.getPieceColor(clickedPiece);

    if (this.selectedSquare) {
      // Check if clicking the same square to deselect
      if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
        this.selectedSquare = null;
      } else {
        // Attempt to move piece from selected square to clicked square
        this.attemptMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
      }
    } else {
      // Select a square if it has a piece of the current player
      if (clickedPiece && clickedPieceColor === this.currentTurn) {
        this.selectedSquare = { row, col };
      }
    }
    this.updateGameInfo();
    this.renderBoard();
  }

  attemptMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const pieceColor = this.getPieceColor(piece);

    // Validate that the piece belongs to the current player
    if (pieceColor !== this.currentTurn) {
      this.selectedSquare = null;
      return;
    }

    // Validate that the destination doesn't have a friendly piece
    const targetPiece = this.board[toRow][toCol];
    const targetColor = this.getPieceColor(targetPiece);
    if (targetColor === this.currentTurn) {
      this.selectedSquare = null;
      return;
    }

    // Move the piece
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    this.selectedSquare = null;
    
    // Switch turn
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
  }

  updateGameInfo() {
    const gameInfo = document.getElementById('game-info');
    const statusElement = gameInfo.querySelector('p');
    if (statusElement) {
      const turnText = this.currentTurn === 'white' ? 'White' : 'Black';
      statusElement.textContent = `${turnText}'s Turn`;
    }
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
