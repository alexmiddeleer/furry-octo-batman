angular.module('Game', ['myApp', 'Grid', 'Logger']);
angular.module('Game').service('Game', function(Grid, Logger,  
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

   ex.pieceChosen = function(square) {
      if (ex.pieceIsMoveable(square)) {
         Grid.forEach(function(square) {
            if (square.piece) {
               square.piece.isSelected = false;
            }
         });
         square.piece.isSelected = true;
         that.selectedPiece = square;
      } else if ( ex.squareIsReachable(square)){
         square.piece = angular.copy(that.selectedPiece.piece);
         that.selectedPiece.piece = null;
         Grid.forEach(function(square) {
            if (square.piece) {
               square.piece.isSelected = false;
            }
         });
      }
   }

   ex.pieceIsMoveable = function(square) {
      if (square.piece && square.piece.owner) {
         if (square.piece.owner === ex.whoseTurn().name) {
            return true;
         }
      }
      return false;
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

   ex.moveIsDiagonal = function(square) {
      var x2 = that.selectedPiece.x - square.x
        , y2 = that.selectedPiece.y - square.y
      return (((x2 + y2) % 2 ) === 0) &&
             (Math.abs(x2) + Math.abs(y2) < 3)
   }

   ex.moveIsDiagonalForward = function(square) {
      var x2 = that.selectedPiece.x - square.x
        , y2 = that.selectedPiece.y - square.y
      return ex.moveIsDiagonal(square) && (y2 === ex.playerDir());
   }

   ex.squareIsReachable = function(square) {
      if (that.selectedPiece) {
         if (!ex.isOccupied(square)) {
            if (ex.isKing(square)) {
               return ex.moveIsDiagonal(square);
            } else {
               return ex.moveIsDiagonalForward(square);
            }
         }
      }
   }

   return ex;
});
