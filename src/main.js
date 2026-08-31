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
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];
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

  getPieceName(piece) {
    const names = {
      'p': 'pawn',
      'r': 'rook',
      'n': 'knight',
      'b': 'bishop',
      'q': 'queen',
      'k': 'king',
    };

    return names[piece.toLowerCase()] || 'piece';
  }

  getSquareLabel(row, col) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const squareName = `${files[col]}${8 - row}`;
    const piece = this.board[row][col];

    if (!piece) {
      return squareName;
    }

    const pieceColor = this.getPieceColor(piece) === 'white' ? 'white' : 'black';
    return `${pieceColor} ${this.getPieceName(piece)} at ${squareName}`;
  }

  isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);
    let row = fromRow + rowStep;
    let col = fromCol + colStep;

    while (row !== toRow || col !== toCol) {
      if (this.board[row][col]) {
        return false;
      }
      row += rowStep;
      col += colStep;
    }

    return true;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const targetPiece = this.board[toRow][toCol];

    if (!piece || (fromRow === toRow && fromCol === toCol)) {
      return false;
    }

    const pieceColor = this.getPieceColor(piece);
    const targetColor = this.getPieceColor(targetPiece);

    if (targetColor === pieceColor) {
      return false;
    }

    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    switch (piece.toLowerCase()) {
      case 'p': {
        const moveDirection = pieceColor === 'white' ? -1 : 1;
        const startingRow = pieceColor === 'white' ? 6 : 1;

        if (colDiff === 0 && !targetPiece) {
          if (rowDiff === moveDirection) {
            return true;
          }

          if (fromRow === startingRow && rowDiff === moveDirection * 2) {
            return this.board[fromRow + moveDirection][fromCol] === null;
          }

          return false;
        }

        return absColDiff === 1 && rowDiff === moveDirection && targetPiece !== null;
      }
      case 'r':
        if (rowDiff !== 0 && colDiff !== 0) {
          return false;
        }
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
      case 'b':
        if (absRowDiff !== absColDiff) {
          return false;
        }
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
      case 'q':
        if (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) {
          return this.isPathClear(fromRow, fromCol, toRow, toCol);
        }
        return false;
      case 'n':
        return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
      case 'k':
        return absRowDiff <= 1 && absColDiff <= 1;
      default:
        return false;
    }
  }

  renderBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.className = 'chess-square';
        square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
        square.tabIndex = 0;
        square.setAttribute('role', 'button');
        square.setAttribute('aria-label', this.getSquareLabel(row, col));

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
        square.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleSquareClick(row, col);
          }
        });
        chessboard.appendChild(square);
      }
    }
  }

  handleSquareClick(row, col) {
    const clickedPiece = this.board[row][col];
    const clickedPieceColor = this.getPieceColor(clickedPiece);

    if (this.selectedSquare) {
      if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
        this.selectedSquare = null;
      } else {
        this.attemptMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
      }
    } else if (clickedPiece && clickedPieceColor === this.currentTurn) {
      this.selectedSquare = { row, col };
    }

    this.updateGameInfo();
    this.renderBoard();
  }

  attemptMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const pieceColor = this.getPieceColor(piece);
    const targetPiece = this.board[toRow][toCol];

    if (targetPiece && this.getPieceColor(targetPiece) === this.currentTurn) {
      this.selectedSquare = { row: toRow, col: toCol };
      return;
    }

    if (pieceColor !== this.currentTurn || !this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      this.selectedSquare = null;
      return;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    this.selectedSquare = null;

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
