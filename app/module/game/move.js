angular.module('Game').service('Move', function(Grid, $rootScope){
   var ex = {}
     , that = {}

   that.movementStack = [];
   that.movementsCount = 0;

   ex.setInitialState = function(grid) {
      that.initialState = angular.copy(grid);
   };

   ex.startOverMove = function() {
      Grid.setGrid(that.initialState);
      that.movementStack = [];
      that.movementsCount = 0;
   }

   ex.deselect = function() {
      that.selectedSquare.piece.isSelected = false;
      that.selectedSquare = null;
   }

   ex.selectSquare = function(square) {
      if (that.selectedSquare && that.selectedSquare.piece) {
         that.selectedSquare.piece.isSelected = false;
      }
      that.selectedSquare = square;
      square.piece.isSelected = true;
   }

   ex.getSelectedSquare = function() {
      return that.selectedSquare;
   }

   that.motion = function(oldSquare, newSquare) {
      return {
         x: newSquare.x - oldSquare.x,
         y: newSquare.y - oldSquare.y
      }
   }

   ex.hasMoved = function() {
      return that.movementsCount > 0;
   }

   that.movePiece = function(square) {
      var pieceToMove = angular.copy(ex.getSelectedSquare().piece);
      delete that.selectedSquare.piece;
      square.piece = pieceToMove;
      ex.selectSquare(square);
   }

   that.deleteJumpedPiece = function(square) {
      var motion = that.motion(ex.getSelectedSquare(), square);
      motion.x += motion.x < 0 ? 1 : -1;
      motion.y += motion.y < 0 ? 1 : -1;
      x = ex.getSelectedSquare().x + motion.x;
      y = ex.getSelectedSquare().y + motion.y;
      square = Grid.getGrid()[y][x];
      delete(square.piece);
   }

   that.jumpPiece = function(square) {
      that.deleteJumpedPiece(square);
      var pieceToMove = angular.copy(ex.getSelectedSquare().piece);
      delete that.selectedSquare.piece;
      square.piece = pieceToMove;
      ex.selectSquare(square);
   }

   ex.executeMovement = function(square) {
      that.movementStack.push(that.motion(ex.getSelectedSquare(), square));
      that.movementsCount++;
      that.movePiece(square);
   }

   ex.executeJump = function(square) {
      that.movementStack.push(that.motion(ex.getSelectedSquare(), square));
      that.movementsCount++;
      that.jumpPiece(square);
   }

   return ex;
});

