angular.module('Game', ['myApp', 'Grid', 'Logger']);
angular.module('Game').service('Game', function(Grid, Logger, Move,
   WHITE_PIECE, WHITE_KING, BLACK_PIECE, BLACK_KING, BOARDSIZE, BLACK_WINS, WHITE_WINS, NUM_PLAYERS,
   WHITE_PLAYER, BLACK_PLAYER) {
   var ex = {}
     , that = {}

   ex.init = function() {
      Grid.init(BOARDSIZE);
      return this;
   }

   that.setUpPieces = function() {
      Grid.forEach(function(square) {
         if (square.y < 3) {
            square.piece = {};
            if (!ex.isBlack(square)) {
               square.piece.symbol = WHITE_PIECE,
               square.piece.owner = WHITE_PLAYER
            }
         }
         if (BOARDSIZE - square.y < 4) {
            square.piece = {};
            if (!ex.isBlack(square)) {
               square.piece.symbol = BLACK_PIECE,
               square.piece.owner = BLACK_PLAYER
            }
         }
      });
   }

   ex.isBlack = function(square) {
      var x = square.x, y = square.y;
      var k = ( y % 2 === 0 ? 0 : 1 );
      return (((y*BOARDSIZE)+x+k)%2 === 0);
   }

   that.hasBlackPiece = function(square) {
      return square.piece && square.piece.symbol === BLACK_PIECE;
   }

   that.hasWhitePiece = function(square) {
      return square.piece && square.piece.symbol === WHITE_PIECE;
   }

   ex.startGame = function() {
      that.setUpPieces();
      that.players = [{
         name: WHITE_PLAYER,
      },{
         name: BLACK_PLAYER
      }];
      that.turn = 0;
   }

   that.gameStatus = function() {
      var whitePieces = 0, blackPieces = 0
      Grid.forEach(function(square){
         if (that.hasBlackPiece(square)) {
            blackPieces++;
         }
         if (that.hasWhitePiece(square)) {
            whitePieces++;
         }
      });
      if (blackPieces===0) {
         return WHITE_WINS;
      } else if( whitePieces === 0){
         return BLACK_WINS;
      }
      return false;
   }

   that.makeMove = function(player, cb) {
      Logger.log('Waiting for ' + player.name + ' to make a move');
   }

   ex.gameLoop = function(roundOverCB, gameOverCB) {
      var gameStatus = that.gameStatus();
      if (gameStatus===WHITE_WINS || gameStatus === BLACK_WINS) {
         gameOverCB(gameStatus);
         return this;
      } else {
         var player = ex.whoseTurn();
         that.makeMove( player, function(move) {
            that.turn++;
            roundOverCB();
            ex.gameLoop();
         });
      }
   }


   ex.squareChosen = function(square) {
      // If piece, and piece is moveable (implies owned), if piece is not current piece, 
      //    mark piece as chosen and reset current move.
      // If empty square is chosen, and a piece is selected, and the square is reachable 
      //    from the selected piece's current location, move piece and add to current move
      if (ex.isOccupied(square)) {
         if (ex.pieceIsMoveable(square.piece)) {
            Move.startOverMove();
            Move.selectSquare(square);
         }
      } else {
         var selectedSquare = Move.getSelectedSquare()
         if (selectedSquare) {
            if (ex.squareIsReachable(square)) {
               if (that.squareIsReachableByMove(square)) {
                  Move.executeMovement(square);
               } else {
                  Move.jumpPieceTo(square);
               }
            }
         }
      }
   }

   that.playerOwnsPiece =  function(piece) {
      return piece.owner && (piece.owner === ex.whoseTurn().name);
   }

   ex.pieceIsMoveable = function(piece) {
      return that.playerOwnsPiece(piece);
   }

   ex.whoseTurn = function() {
      return (that.players[ that.turn % NUM_PLAYERS ]);
   }

   ex.isKing = function(square) {
      return square.piece && square.piece.symbol && (square.piece.symbol === BLACK_KING ||
             square.piece.symbol === WHITE_KING );
   }

   ex.isOccupied = function(square) {
      return square.piece && square.piece.symbol && square.piece.symbol !== '';
   }

   ex.playerDir = function() {
      if (ex.whoseTurn().name === WHITE_PLAYER) {
         return -1
      } else {
         return 1;
      }
   }

   ex.moveIsDiagonal = function(square, selected) {
      var x2 = selected.x - square.x
        , y2 = selected.y - square.y
      return (((x2 + y2) % 2 ) === 0) &&
             (Math.abs(x2) + Math.abs(y2) < 3)
   }

   ex.moveIsDiagonalForward = function(square, selected) {
      var x2 = selected.x - square.x
        , y2 = selected.y - square.y
      return ex.moveIsDiagonal(square, selected) && (y2 === ex.playerDir());
   }

   that.squareIsReachableByMove = function(square) {
      var selected = Move.getSelectedSquare();
      if (selected){
         if (!ex.isOccupied(square)) {
            if (!Move.hasMoved()) {
               if (ex.isKing(square)) {
                  return ex.moveIsDiagonal(square, selected);
               } else {
                  return ex.moveIsDiagonalForward(square, selected);
               }
            }
         }
      }
   }

   that.squareIsReachableByJump = function(square) {
      return false;
   }

   ex.squareIsReachable = function(square) {
      return that.squareIsReachableByMove(square) || that.squareIsReachableByJump(square);
   }

   return ex;
});
