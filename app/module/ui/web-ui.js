// This service essentially inherits from uI, but UI supposed to be too abstract 
// do deal with things like clicks and classes
angular.module('Ui').service('WebUi', function(Logger, Ui, Grid, Game) {

   var ex = Ui
     , that = {}

   ex.squareClicked = function(square) {
      Ui.squareSelected(square);
   }

   ex.styleBackground = function() {
      Grid.forEach( function(square) {
         square.background = Game.isBlack( square ) ?
            'black-space' : 'white-space';
      })
   }

   ex.getSquareBackground = function(square){
      if (Game.pieceIsMoveable(square) && square.piece.isSelected) {
         return 'selected-space';
      }
      if (Game.pieceIsMoveable(square) && square.mouseOver) {
         return 'selectable-space';
      }
      if (Game.squareIsReachable(square) && square.mouseOver) {
         return 'selectable-space';
      }
   }

   return ex;
});

