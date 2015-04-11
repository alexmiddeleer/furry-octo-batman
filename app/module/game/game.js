angular.module('Game', ['myApp', 'Grid', 'Logger']);
angular.module('Game').service('Game', function(Grid, Logger, Move,
   WHITE_PIECE, WHITE_KING, BLACK_PIECE, BLACK_KING, BOARDSIZE, BLACK_WINS, WHITE_WINS,
   NUM_PLAYERS, WHITE_PLAYER, BLACK_PLAYER) {

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

   that.setMoveOverHandler = function(player, cb) {
      that.moveOverHandler = cb;
   }

   ex.gameLoop = function(roundOverCB, gameOverCB) {
      var gameStatus = that.gameStatus();
      if (gameStatus===WHITE_WINS || gameStatus === BLACK_WINS) {
         gameOverCB(gameStatus);
         return this;
      } else {
         var player = ex.whoseTurn();
         Move.setInitialState( Grid.getGrid() );
         that.setMoveOverHandler( player, function(move) {
            Logger.log('Waiting for ' + player.name + ' to make a move');
            Move.deselect();
            that.turn++;
            roundOverCB();
            ex.gameLoop(roundOverCB, gameOverCB);
         });
      }
   }

   ex.squareChosen = function(square) {
      // If piece, and piece is moveable (implies owned), if piece is not current piece,
      //    mark piece as chosen and reset current move.
      // If empty square is chosen, and a piece is selected, and the square is reachable
      //    from the selected piece's current location, move piece and add to current
      //    move
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
                  Move.executeJump(square);
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

   that.isDiagonal = function(square, selected, distance) {
      var x2 = selected.x - square.x
        , y2 = selected.y - square.y
      return ((Math.abs(x2) === distance) && (Math.abs(y2) === distance));
   }

   ex.moveIsDiagonal = function(square, selected) {
      return that.isDiagonal(square, selected, 1);
   }

   ex.jumpIsDiagonal = function(square, selected) {
      return that.isDiagonal(square, selected, 2);
   }

   ex.moveIsDiagonalForward = function(square, selected) {
      var x2 = selected.x - square.x
        , y2 = selected.y - square.y
      return ex.moveIsDiagonal(square, selected) && (y2 === ex.playerDir());
   }

   ex.jumpIsDiagonalForward = function(square, selected) {
      var x2 = selected.x - square.x
        , y2 = selected.y - square.y
      return ex.jumpIsDiagonal(square, selected) && ((y2/Math.abs(y2)) === ex.playerDir());
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

   that.squareJumpedHasPiece = function(square) {
      var jumpedSquare = Move.getJumpedSquare(square);
      return jumpedSquare.piece;
   }

   that.squareIsReachableByJump = function(square) {
      var selected = Move.getSelectedSquare();
      if (selected && that.squareJumpedHasPiece(square)){
         if (!ex.isOccupied(square)) {
            if (ex.isKing(square)) {
               return ex.jumpIsDiagonal(square, selected);
            } else {
               return ex.jumpIsDiagonalForward(square, selected);
            }
         }
      }
   }

   ex.squareIsReachable = function(square) {
      var selectedSquare = Move.getSelectedSquare()
      if (selectedSquare) {
         return ( that.squareIsReachableByMove(square) ||
                  that.squareIsReachableByJump(square));
      }
      return false;
   }

   ex.getModel = function() {
      return Grid.getGrid();
   }

   ex.endTurn = function() {
      if (Move.hasMoved()) {
         that.moveOverHandler();
         return true;
      } else {
         return false;
      }
   }

   return ex;
});
