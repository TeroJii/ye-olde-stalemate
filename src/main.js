/**
 * Chess Game - Main Application
 */

class ChessGame {
  constructor() {
    this.board = this.initializeBoard();
    this.selectedSquare = null;
    this.currentTurn = 'white'; // 'white' or 'black'
    this.gameOver = false;
    this.winnerMessage = '';
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

  isPseudoValidMove(fromRow, fromCol, toRow, toCol, board) {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

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

    const isPathClearOnBoard = (fr, fc, tr, tc) => {
      const rowStep = Math.sign(tr - fr);
      const colStep = Math.sign(tc - fc);
      let r = fr + rowStep;
      let c = fc + colStep;
      while (r !== tr || c !== tc) {
        if (board[r][c]) return false;
        r += rowStep;
        c += colStep;
      }
      return true;
    };

    switch (piece.toLowerCase()) {
      case 'p': {
        const moveDirection = pieceColor === 'white' ? -1 : 1;
        const startingRow = pieceColor === 'white' ? 6 : 1;

        if (colDiff === 0 && !targetPiece) {
          if (rowDiff === moveDirection) {
            return true;
          }

          if (fromRow === startingRow && rowDiff === moveDirection * 2) {
            return board[fromRow + moveDirection][fromCol] === null;
          }

          return false;
        }

        return absColDiff === 1 && rowDiff === moveDirection && targetPiece !== null;
      }
      case 'r':
        if (rowDiff !== 0 && colDiff !== 0) {
          return false;
        }
        return isPathClearOnBoard(fromRow, fromCol, toRow, toCol);
      case 'b':
        if (absRowDiff !== absColDiff) {
          return false;
        }
        return isPathClearOnBoard(fromRow, fromCol, toRow, toCol);
      case 'q':
        if (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) {
          return isPathClearOnBoard(fromRow, fromCol, toRow, toCol);
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

  isInCheck(color, board) {
    const kingPiece = color === 'white' ? 'K' : 'k';
    let kingRow = -1;
    let kingCol = -1;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === kingPiece) {
          kingRow = r;
          kingCol = c;
        }
      }
    }

    if (kingRow === -1) return false;

    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] && this.getPieceColor(board[r][c]) === opponentColor) {
          if (this.isPseudoValidMove(r, c, kingRow, kingCol, board)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const color = this.getPieceColor(piece);

    const boardCopy = this.board.map(row => [...row]);
    boardCopy[toRow][toCol] = boardCopy[fromRow][fromCol];
    boardCopy[fromRow][fromCol] = null;

    return this.isInCheck(color, boardCopy);
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (!this.isPseudoValidMove(fromRow, fromCol, toRow, toCol, this.board)) {
      return false;
    }
    return !this.wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol);
  }

  getLegalMoves(color) {
    const moves = [];
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        if (this.getPieceColor(this.board[fromRow][fromCol]) !== color) continue;
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
              moves.push({ fromRow, fromCol, toRow, toCol });
            }
          }
        }
      }
    }
    return moves;
  }

  renderBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    const inCheck = !this.gameOver && this.isInCheck(this.currentTurn, this.board);
    const kingPiece = this.currentTurn === 'white' ? 'K' : 'k';

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
        } else if (inCheck && this.board[row][col] === kingPiece) {
          square.classList.add('in-check');
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
    if (this.gameOver) return;

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
    const targetPiece = this.board[toRow][toCol];

    if (targetPiece && this.getPieceColor(targetPiece) === this.currentTurn) {
      this.selectedSquare = { row: toRow, col: toCol };
      return;
    }

    if (!piece || !this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      this.selectedSquare = null;
      return;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    this.selectedSquare = null;

    const nextTurn = this.currentTurn === 'white' ? 'black' : 'white';
    this.currentTurn = nextTurn;

    if (this.getLegalMoves(this.currentTurn).length === 0) {
      this.gameOver = true;
      if (this.isInCheck(this.currentTurn, this.board)) {
        const winner = this.currentTurn === 'white' ? 'Black' : 'White';
        this.winnerMessage = `Checkmate! ${winner} wins!`;
      } else {
        this.winnerMessage = "Stalemate! It's a draw!";
      }
    }
  }

  updateGameInfo() {
    const gameInfo = document.getElementById('game-info');
    const statusElement = gameInfo.querySelector('p');
    if (statusElement) {
      if (this.gameOver) {
        statusElement.textContent = this.winnerMessage;
      } else {
        const turnText = this.currentTurn === 'white' ? 'White' : 'Black';
        const inCheck = this.isInCheck(this.currentTurn, this.board);
        statusElement.textContent = inCheck ? `${turnText}'s Turn - Check!` : `${turnText}'s Turn`;
      }
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
