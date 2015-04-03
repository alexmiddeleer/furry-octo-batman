angular.module('Game').service('Move', function(Grid, $rootScope){
   var ex = {}
     , that = {}

   that.movementStack = [];
   that.movementsCount = 0;

   ex.startOverMove = function() {
      //TODO
      //Grid.setGrid(that.originalGrid);
      //that.movementStack = [];
      //that.movementsCount = 0;
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

   ex.executeMovement = function(square) {
      that.movementStack.push(that.motion(ex.getSelectedSquare(), square));
      that.movementsCount++;
      that.movePiece(square);
   }

   return ex;
});

